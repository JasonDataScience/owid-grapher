import * as React from "react"
import { Bounds, DEFAULT_BOUNDS } from "grapher/utils/Bounds"
import { observable, computed, action } from "mobx"
import { observer } from "mobx-react"
import {
    CategoricalColorLegend,
    CategoricalColorLegendManager,
    NumericColorLegend,
    NumericColorLegendManager,
} from "grapher/mapCharts/MapColorLegends"
import {
    findClosestTime,
    flatten,
    getRelativeMouse,
    isString,
    identity,
    sortBy,
    guid,
    minBy,
} from "grapher/utils/Util"
import { MapProjection, MapProjections } from "./MapProjections"
import { select } from "d3-selection"
import { easeCubic } from "d3-ease"
import { MapTooltip } from "./MapTooltip"
import { ProjectionChooser } from "./ProjectionChooser"
import { isOnTheMap } from "./EntitiesOnTheMap"
import { EntityName } from "coreTable/CoreTableConstants"
import {
    GeoFeature,
    MapBracket,
    MapChartManager,
    MapEntity,
    ChoroplethMapProps,
    RenderFeature,
    ChoroplethSeries,
} from "./MapChartConstants"
import { MapConfig } from "./MapConfig"
import { ColorScale, ColorScaleManager } from "grapher/color/ColorScale"
import { BASE_FONT_SIZE, SeriesName } from "grapher/core/GrapherConstants"
import { ChartInterface } from "grapher/chart/ChartInterface"
import {
    CategoricalBin,
    ColorScaleBin,
    NumericBin,
} from "grapher/color/ColorScaleBin"
import { TextWrap } from "grapher/text/TextWrap"
import * as topojson from "topojson-client"
import { MapTopology } from "./MapTopology"
import { PointVector } from "grapher/utils/PointVector"
import { worldRegionByMapEntity } from "./WorldRegions"

const PROJECTION_CHOOSER_WIDTH = 110
const PROJECTION_CHOOSER_HEIGHT = 22

// TODO refactor to use transform pattern, bit too much info for a pure component

interface MapChartProps {
    bounds?: Bounds
    manager: MapChartManager
    containerElement?: HTMLDivElement
}

@observer
export class MapChart
    extends React.Component<MapChartProps>
    implements
        ChartInterface,
        CategoricalColorLegendManager,
        NumericColorLegendManager,
        ColorScaleManager {
    @observable.ref tooltip: React.ReactNode | null = null
    @observable tooltipTarget?: { x: number; y: number; featureId: string }

    @observable focusEntity?: MapEntity
    @observable focusBracket?: MapBracket

    @computed get failMessage() {
        if (!this.mapColumn) return "Missing map column"
        return ""
    }

    @computed get mapColumn() {
        return this.table.get(
            this.manager.mapColumnSlug ||
                this.manager.yColumnSlug ||
                this.manager.yColumnSlugs![0]
        )
    }

    @computed get bounds() {
        return this.props.bounds ?? DEFAULT_BOUNDS
    }

    base: React.RefObject<SVGGElement> = React.createRef()
    @action.bound onMapMouseOver(feature: GeoFeature, ev: React.MouseEvent) {
        const datum =
            feature.id === undefined
                ? undefined
                : this.seriesMap.get(feature.id as string)
        this.focusEntity = {
            id: feature.id,
            datum: datum || { value: "No data" },
        }

        const { containerElement } = this.props
        if (!containerElement) return

        const mouse = getRelativeMouse(containerElement, ev)
        if (feature.id !== undefined)
            this.tooltipTarget = {
                x: mouse.x,
                y: mouse.y,
                featureId: feature.id as string,
            }
    }

    @action.bound onMapMouseLeave() {
        this.focusEntity = undefined
        this.tooltipTarget = undefined
    }

    @computed get manager() {
        return this.props.manager
    }

    @computed get table() {
        return this.manager.table
    }

    @computed get rootTable() {
        return this.table.rootTable
    }

    // Determine if we can go to line chart by clicking on a given map entity
    private isEntityClickable(entityName?: EntityName) {
        if (!this.manager.mapIsClickable || !entityName) return false

        return this.table.availableEntityNameSet.has(entityName)
    }

    @action.bound onClick(d: GeoFeature, ev: React.MouseEvent<SVGElement>) {
        const entityName = d.id as EntityName
        if (!this.isEntityClickable(entityName)) return

        if (!ev.shiftKey) {
            this.rootTable.setSelectedEntities([entityName])
            this.manager.currentTab = "chart"
        } else this.rootTable.toggleSelection(entityName)
    }

    componentWillUnmount() {
        this.onMapMouseLeave()
        this.onLegendMouseLeave()
    }

    @action.bound onLegendMouseOver(bracket: MapBracket) {
        this.focusBracket = bracket
    }

    @action.bound onLegendMouseLeave() {
        this.focusBracket = undefined
    }

    @computed get mapConfig() {
        return this.manager.mapConfig || new MapConfig()
    }

    @action.bound onProjectionChange(value: MapProjection) {
        this.mapConfig.projection = value
    }

    @computed get series(): ChoroplethSeries[] {
        const { mapConfig, mapColumn, table } = this
        if (!mapColumn) return []
        const endTime = mapColumn.endTimelineTime
        if (endTime === undefined) return []

        const valueByEntityAndTime = mapColumn.valueByEntityNameAndTime
        const tolerance = mapConfig.timeTolerance ?? 0
        const countriesOnTheMap = mapColumn.entityNamesUniqArr.filter((name) =>
            isOnTheMap(name)
        )

        const customLabels = mapConfig.tooltipUseCustomLabels
            ? this.colorScale.customNumericLabels
            : []

        return countriesOnTheMap
            .map((entityName) => {
                const valueByTime = valueByEntityAndTime.get(entityName)
                if (!valueByTime) return
                const time = findClosestTime(
                    Array.from(valueByTime.keys()),
                    endTime,
                    tolerance
                )
                if (time === undefined) return
                const value = valueByTime.get(time)
                if (value === undefined) return

                const color = this.colorScale.getColor(value) || "red" // todo: color fix
                if (!color) return

                return {
                    seriesName: entityName,
                    displayValue:
                        customLabels[value as any] ??
                        mapColumn.formatValueLong(value),
                    time,
                    value,
                    isSelected: table.isEntitySelected(entityName),
                    color,
                    highlightFillColor: color,
                }
            })
            .filter((i) => i) as ChoroplethSeries[]
    }

    @computed private get seriesMap() {
        const map = new Map<SeriesName, ChoroplethSeries>()
        this.series.forEach((series) => {
            map.set(series.seriesName, series)
        })
        return map
    }

    @computed get colorScaleColumn() {
        return this.mapColumn
    }

    @computed get colorScale() {
        return new ColorScale(this)
    }

    @computed get colorScaleConfig() {
        return this.mapConfig.colorScale
    }

    defaultBaseColorScheme = "BuGn"
    hasNoDataBin = true

    @computed get categoricalValues() {
        // return uniq(this.mappableData.values.filter(isString))
        // return this.options.mapColumn.values || [] // todo: mappable data
        return this.mapColumn!.parsedValues.filter(isString)
    }

    componentDidMount() {
        select(this.base.current)
            .selectAll("path")
            .attr("data-fill", function () {
                return (this as SVGPathElement).getAttribute("fill")
            })
            .attr("fill", this.colorScale.noDataColor)
            .transition()
            .duration(500)
            .ease(easeCubic)
            .attr("fill", function () {
                return (this as SVGPathElement).getAttribute("data-fill")
            })
            .attr("data-fill", function () {
                return (this as SVGPathElement).getAttribute("fill")
            })
    }

    @computed get projectionChooserBounds() {
        const { bounds } = this
        return new Bounds(
            bounds.width - PROJECTION_CHOOSER_WIDTH + 15 - 3,
            5,
            PROJECTION_CHOOSER_WIDTH,
            PROJECTION_CHOOSER_HEIGHT
        )
    }

    @computed get legendData() {
        return this.colorScale.legendBins
    }

    @computed get equalSizeBins() {
        return this.colorScale.config.equalSizeBins
    }

    @computed get legendTitle() {
        return ""
    }

    @computed get focusValue() {
        return this.focusEntity?.datum?.value
    }

    @computed get fontSize() {
        return this.manager.baseFontSize ?? BASE_FONT_SIZE
    }

    @computed get numericLegendData() {
        if (
            this.hasCategorical ||
            !this.legendData.some(
                (d) => (d as CategoricalBin).value === "No data" && !d.isHidden
            )
        )
            return this.legendData.filter(
                (l) => l instanceof NumericBin && !l.isHidden
            )

        const bin = this.legendData.filter(
            (l) =>
                (l instanceof NumericBin || l.value === "No data") &&
                !l.isHidden
        )
        return flatten([bin[bin.length - 1], bin.slice(0, -1)])
    }

    @computed get hasNumeric() {
        return this.numericLegendData.length > 1
    }

    @computed get categoricalLegendData() {
        return this.legendData.filter(
            (l) => l instanceof CategoricalBin && !l.isHidden
        ) as CategoricalBin[]
    }

    @computed get hasCategorical() {
        return this.categoricalLegendData.length > 1
    }

    @computed get mainLegendLabel() {
        return new TextWrap({
            maxWidth: this.legendBounds.width,
            fontSize: 0.7 * this.fontSize,
            text: this.legendTitle,
        })
    }

    @computed get numericFocusBracket(): ColorScaleBin | undefined {
        const { focusBracket, focusValue } = this
        const { numericLegendData } = this

        if (focusBracket) return focusBracket

        if (focusValue)
            return numericLegendData.find((bin) => bin.contains(focusValue))

        return undefined
    }

    @computed get categoricalFocusBracket() {
        const { focusBracket, focusValue } = this
        const { categoricalLegendData } = this
        if (focusBracket && focusBracket instanceof CategoricalBin)
            return focusBracket

        if (focusValue)
            return categoricalLegendData.find((bin) => bin.contains(focusValue))

        return undefined
    }

    @computed get legendBounds() {
        return this.bounds.padBottom(15)
    }

    @computed get legendWidth() {
        return this.legendBounds.width * 0.8
    }

    @computed get legendHeight() {
        return (
            this.mainLegendLabel.height +
            this.categoryLegendHeight +
            this.numericLegendHeight +
            10
        )
    }

    @computed get numericLegendHeight() {
        return 5
    }

    @computed get categoryLegendHeight() {
        return 5
    }

    @computed get categoryLegend() {
        return this.categoricalLegendData.length > 1
            ? new CategoricalColorLegend({ manager: this })
            : undefined
    }

    @computed get numericLegend() {
        return this.numericLegendData.length > 1
            ? new NumericColorLegend({ manager: this })
            : undefined
    }

    @computed get legendX(): number {
        const { bounds, numericLegend, categoryLegend } = this
        if (numericLegend) return bounds.centerX - this.legendWidth / 2

        if (categoryLegend) return bounds.centerX - categoryLegend!.width / 2
        return 0
    }

    @computed get legendY(): number {
        const {
            bounds,
            numericLegend,
            categoryLegend,
            mainLegendLabel,
            categoryLegendHeight,
        } = this
        if (numericLegend)
            return (
                bounds.bottom -
                mainLegendLabel.height -
                categoryLegendHeight -
                numericLegend!.height -
                4
            )

        if (categoryLegend)
            return bounds.bottom - mainLegendLabel.height - categoryLegendHeight
        return 0
    }

    renderMapLegend() {
        const { bounds, mainLegendLabel, numericLegend, categoryLegend } = this

        return (
            <g className="mapLegend">
                {numericLegend && <NumericColorLegend manager={this} />}
                {categoryLegend && <CategoricalColorLegend manager={this} />}
                {mainLegendLabel.render(
                    bounds.centerX - mainLegendLabel.width / 2,
                    bounds.bottom - mainLegendLabel.height
                )}
            </g>
        )
    }

    render() {
        const {
            focusBracket,
            focusEntity,
            tooltipTarget,
            projectionChooserBounds,
            seriesMap,
            colorScale,
            mapConfig,
        } = this

        const { projection } = mapConfig

        const tooltipDatum = tooltipTarget
            ? seriesMap.get(tooltipTarget.featureId)
            : undefined

        return (
            <g ref={this.base} className="mapTab">
                <ChoroplethMap
                    bounds={this.bounds.padBottom(this.legendHeight + 15)}
                    choroplethData={seriesMap}
                    projection={projection}
                    defaultFill={colorScale.noDataColor}
                    onHover={this.onMapMouseOver}
                    onHoverStop={this.onMapMouseLeave}
                    onClick={this.onClick}
                    focusBracket={focusBracket}
                    focusEntity={focusEntity}
                />
                {this.renderMapLegend()}
                <foreignObject id="projection-chooser">
                    <ProjectionChooser
                        bounds={projectionChooserBounds}
                        value={projection}
                        onChange={this.onProjectionChange}
                    />
                </foreignObject>
                {tooltipTarget && (
                    <MapTooltip
                        tooltipDatum={tooltipDatum}
                        isEntityClickable={this.isEntityClickable(
                            tooltipTarget?.featureId
                        )}
                        tooltipTarget={tooltipTarget}
                        manager={this.manager}
                        colorScale={this.colorScale}
                    />
                )}
            </g>
        )
    }
}

declare type SVGMouseEvent = React.MouseEvent<SVGElement>

@observer
class ChoroplethMap extends React.Component<ChoroplethMapProps> {
    base: React.RefObject<SVGGElement> = React.createRef()

    @computed private get uid() {
        return guid()
    }

    @computed.struct private get bounds() {
        return this.props.bounds
    }

    @computed.struct private get choroplethData() {
        return this.props.choroplethData
    }

    @computed.struct private get defaultFill() {
        return this.props.defaultFill
    }

    // Get the underlying geographical topology elements we're going to display
    @computed private get geoFeatures(): GeoFeature[] {
        return (topojson.feature(
            MapTopology as any,
            MapTopology.objects.world as any
        ) as any).features
    }

    // The d3 path generator for this projection
    @computed private get pathGen() {
        return MapProjections[this.props.projection]
    }

    // Get the bounding box for every geographical feature
    @computed private get geoBounds() {
        return this.geoFeatures.map((d) => {
            const b = this.pathGen.bounds(d)

            const bounds = Bounds.fromCorners(
                new PointVector(...b[0]),
                new PointVector(...b[1])
            )

            // HACK (Mispy): The path generator calculates weird bounds for Fiji (probably it wraps around the map)
            if (d.id === "Fiji")
                return bounds.extend({
                    x: bounds.right - bounds.height,
                    width: bounds.height,
                })
            return bounds
        })
    }

    // Combine bounding boxes to get the extents of the entire map
    @computed private get mapBounds() {
        return Bounds.merge(this.geoBounds)
    }

    // Get the svg path specification string for every feature
    @computed private get geoPaths() {
        const { geoFeatures, pathGen } = this

        return geoFeatures.map((feature) => {
            const s = pathGen(feature) as string
            const paths = s.split(/Z/).filter(identity)

            const newPaths = paths.map((path) => {
                const points = path.split(/[MLZ]/).filter((f: any) => f)
                const rounded = points.map((point) =>
                    point
                        .split(/,/)
                        .map((v) => parseFloat(v).toFixed(1))
                        .join(",")
                )
                return "M" + rounded.join("L")
            })

            return newPaths.join("Z") + "Z"
        })
    }

    // Bundle GeoFeatures with the calculated info needed to render them
    @computed private get renderFeatures(): RenderFeature[] {
        return this.geoFeatures.map((geo, index) => ({
            id: geo.id as string,
            geo: geo,
            path: this.geoPaths[index],
            bounds: this.geoBounds[index],
            center: this.geoBounds[index].centerPos,
        }))
    }

    @computed private get focusBracket() {
        return this.props.focusBracket
    }

    @computed private get focusEntity() {
        return this.props.focusEntity
    }

    // Check if a geo entity is currently focused, either directly or via the bracket
    private hasFocus(id: string) {
        const { choroplethData, focusBracket, focusEntity } = this
        if (focusEntity && focusEntity.id === id) return true
        else if (!focusBracket) return false

        const datum = choroplethData.get(id) || null
        if (focusBracket.contains(datum?.value)) return true
        else return false
    }

    private isSelected(id: string) {
        return this.choroplethData.get(id)!.isSelected
    }

    // Viewport for each projection, defined by center and width+height in fractional coordinates
    @computed private get viewport() {
        const viewports = {
            World: { x: 0.565, y: 0.5, width: 1, height: 1 },
            Europe: { x: 0.5, y: 0.22, width: 0.2, height: 0.2 },
            Africa: { x: 0.49, y: 0.7, width: 0.21, height: 0.38 },
            NorthAmerica: { x: 0.49, y: 0.4, width: 0.19, height: 0.32 },
            SouthAmerica: { x: 0.52, y: 0.815, width: 0.1, height: 0.26 },
            Asia: { x: 0.75, y: 0.45, width: 0.3, height: 0.5 },
            Oceania: { x: 0.51, y: 0.75, width: 0.1, height: 0.2 },
        }

        return viewports[this.props.projection]
    }

    // Calculate what scaling should be applied to the untransformed map to match the current viewport to the container
    @computed private get viewportScale() {
        const { bounds, viewport, mapBounds } = this
        const viewportWidth = viewport.width * mapBounds.width
        const viewportHeight = viewport.height * mapBounds.height
        return Math.min(
            bounds.width / viewportWidth,
            bounds.height / viewportHeight
        )
    }

    @computed private get matrixTransform() {
        const { bounds, mapBounds, viewport, viewportScale } = this

        // Calculate our reference dimensions. These values are independent of the current
        // map translation and scaling.
        const mapX = mapBounds.x + 1
        const mapY = mapBounds.y + 1

        // Work out how to center the map, accounting for the new scaling we've worked out
        const newWidth = mapBounds.width * viewportScale
        const newHeight = mapBounds.height * viewportScale
        const boundsCenterX = bounds.left + bounds.width / 2
        const boundsCenterY = bounds.top + bounds.height / 2
        const newCenterX =
            mapX + (viewportScale - 1) * mapBounds.x + viewport.x * newWidth
        const newCenterY =
            mapY + (viewportScale - 1) * mapBounds.y + viewport.y * newHeight
        const newOffsetX = boundsCenterX - newCenterX
        const newOffsetY = boundsCenterY - newCenterY

        const matrixStr = `matrix(${viewportScale},0,0,${viewportScale},${newOffsetX},${newOffsetY})`
        return matrixStr
    }

    // Features that aren't part of the current projection (e.g. India if we're showing Africa)
    @computed private get featuresOutsideProjection() {
        const { projection } = this.props
        return this.renderFeatures.filter(
            (feature) =>
                projection !== "World" &&
                worldRegionByMapEntity[feature.id] !== projection
        )
    }

    @computed private get featuresInProjection() {
        const { projection } = this.props
        return this.renderFeatures.filter(
            (feature) =>
                projection === "World" ||
                worldRegionByMapEntity[feature.id] === projection
        )
    }

    @computed private get featuresWithNoData() {
        return this.featuresInProjection.filter(
            (feature) => !this.choroplethData.has(feature.id)
        )
    }

    @computed private get featuresWithData() {
        return this.featuresInProjection.filter((feature) =>
            this.choroplethData.has(feature.id)
        )
    }

    // Map uses a hybrid approach to mouseover
    // If mouse is inside an element, that is prioritized
    // Otherwise we look for the closest center point of a feature bounds, so that we can hover
    // very small countries without trouble

    @observable private hoverEnterFeature?: RenderFeature
    @observable private hoverNearbyFeature?: RenderFeature
    @action.bound private onMouseMove(ev: React.MouseEvent<SVGGElement>) {
        if (ev.shiftKey) this.showSelectedStyle = true // Turn on highlight selection. To turn off, user can switch tabs.
        if (this.hoverEnterFeature) return

        const { featuresInProjection } = this
        const mouse = getRelativeMouse(
            this.base.current!.querySelector(".subunits"),
            ev
        )

        const featuresWithDistance = featuresInProjection.map((feature) => {
            return {
                feature,
                distance: PointVector.distance(feature.center, mouse),
            }
        })

        const feature = minBy(featuresWithDistance, (d) => d.distance)

        if (feature && feature.distance < 20) {
            if (feature.feature !== this.hoverNearbyFeature) {
                this.hoverNearbyFeature = feature.feature
                this.props.onHover(feature.feature.geo, ev)
            }
        } else {
            this.hoverNearbyFeature = undefined
            this.props.onHoverStop()
        }
    }

    @action.bound private onMouseEnter(
        feature: RenderFeature,
        ev: SVGMouseEvent
    ) {
        this.hoverEnterFeature = feature
        this.props.onHover(feature.geo, ev)
    }

    @action.bound private onMouseLeave() {
        this.hoverEnterFeature = undefined
        this.props.onHoverStop()
    }

    @computed private get hoverFeature() {
        return this.hoverEnterFeature || this.hoverNearbyFeature
    }

    @action.bound private onClick(ev: React.MouseEvent<SVGGElement>) {
        if (this.hoverFeature !== undefined)
            this.props.onClick(this.hoverFeature.geo, ev)
    }

    // If true selected countries will have an outline
    @observable private showSelectedStyle = false

    // SVG layering is based on order of appearance in the element tree (later elements rendered on top)
    // The ordering here is quite careful
    render() {
        const {
            uid,
            bounds,
            choroplethData,
            defaultFill,
            matrixTransform,
            viewportScale,
            featuresOutsideProjection,
            featuresWithNoData,
            featuresWithData,
        } = this
        const focusStrokeColor = "#111"
        const focusStrokeWidth = 1.5
        const selectedStrokeWidth = 1
        const blurFillOpacity = 0.2
        const blurStrokeOpacity = 0.5

        return (
            <g
                ref={this.base}
                className="ChoroplethMap"
                clipPath={`url(#boundsClip-${uid})`}
                onMouseDown={
                    (ev: SVGMouseEvent) =>
                        ev.preventDefault() /* Without this, title may get selected while shift clicking */
                }
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
                style={this.hoverFeature ? { cursor: "pointer" } : {}}
            >
                <rect
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    fill="rgba(255,255,255,0)"
                    opacity={0}
                />
                <defs>
                    <clipPath id={`boundsClip-${uid}`}>
                        <rect
                            x={bounds.x}
                            y={bounds.y}
                            width={bounds.width}
                            height={bounds.height}
                        ></rect>
                    </clipPath>
                </defs>
                <g className="subunits" transform={matrixTransform}>
                    {featuresOutsideProjection.length && (
                        <g className="nonProjectionFeatures">
                            {featuresOutsideProjection.map((feature) => {
                                return (
                                    <path
                                        key={feature.id}
                                        d={feature.path}
                                        strokeWidth={0.3 / viewportScale}
                                        stroke={"#aaa"}
                                        fill={"#fff"}
                                    />
                                )
                            })}
                        </g>
                    )}

                    {featuresWithNoData.length && (
                        <g className="noDataFeatures">
                            {featuresWithNoData.map((feature) => {
                                const isFocus = this.hasFocus(feature.id)
                                const outOfFocusBracket =
                                    !!this.focusBracket && !isFocus
                                const stroke = isFocus
                                    ? focusStrokeColor
                                    : "#aaa"
                                const fillOpacity = outOfFocusBracket
                                    ? blurFillOpacity
                                    : 1
                                const strokeOpacity = outOfFocusBracket
                                    ? blurStrokeOpacity
                                    : 1
                                return (
                                    <path
                                        key={feature.id}
                                        d={feature.path}
                                        strokeWidth={
                                            (isFocus ? focusStrokeWidth : 0.3) /
                                            viewportScale
                                        }
                                        stroke={stroke}
                                        strokeOpacity={strokeOpacity}
                                        cursor="pointer"
                                        fill={defaultFill}
                                        fillOpacity={fillOpacity}
                                        onClick={(ev: SVGMouseEvent) =>
                                            this.props.onClick(feature.geo, ev)
                                        }
                                        onMouseEnter={(ev) =>
                                            this.onMouseEnter(feature, ev)
                                        }
                                        onMouseLeave={this.onMouseLeave}
                                    />
                                )
                            })}
                        </g>
                    )}

                    {sortBy(
                        featuresWithData.map((feature) => {
                            const isFocus = this.hasFocus(feature.id)
                            const showSelectedStyle =
                                this.showSelectedStyle &&
                                this.isSelected(feature.id)
                            const outOfFocusBracket =
                                !!this.focusBracket && !isFocus
                            const datum = choroplethData.get(
                                feature.id as string
                            )
                            const stroke =
                                isFocus || showSelectedStyle
                                    ? focusStrokeColor
                                    : "#333"
                            const fill = datum ? datum.color : defaultFill
                            const fillOpacity = outOfFocusBracket
                                ? blurFillOpacity
                                : 1
                            const strokeOpacity = outOfFocusBracket
                                ? blurStrokeOpacity
                                : 1

                            return (
                                <path
                                    key={feature.id}
                                    d={feature.path}
                                    strokeWidth={
                                        (isFocus
                                            ? focusStrokeWidth
                                            : showSelectedStyle
                                            ? selectedStrokeWidth
                                            : 0.3) / viewportScale
                                    }
                                    stroke={stroke}
                                    strokeOpacity={strokeOpacity}
                                    cursor="pointer"
                                    fill={fill}
                                    fillOpacity={fillOpacity}
                                    onClick={(ev: SVGMouseEvent) =>
                                        this.props.onClick(feature.geo, ev)
                                    }
                                    onMouseEnter={(ev) =>
                                        this.onMouseEnter(feature, ev)
                                    }
                                    onMouseLeave={this.onMouseLeave}
                                />
                            )
                        }),
                        (p) => p.props["strokeWidth"]
                    )}
                </g>
            </g>
        )
    }
}

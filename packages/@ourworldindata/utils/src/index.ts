export type {
    OwidVariableDisplayConfigInterface,
    OwidVariableDataTableConfigInteface,
    OwidChartDimensionInterface,
} from "./OwidVariableDisplayConfigInterface.js"

export {
    type AlgoliaRecord,
    type Annotation,
    AxisAlign,
    type BasicChartInformation,
    BLOCK_WRAPPER_DATATYPE,
    BlockImageSize,
    checkIsBlockImageSize,
    type BlockPositionChoice,
    type Box,
    type CategoryNode,
    type CategoryWithEntries,
    type ChartPositionChoice,
    type ChartRecord,
    type Color,
    type ColumnSlug,
    type DataValueConfiguration,
    type DataValueProps,
    type DataValueQueryArgs,
    type DataValueResult,
    type Deploy,
    type DeployChange,
    DeployStatus,
    type EnrichedDetail,
    type DetailDictionary,
    DimensionProperty,
    type DocumentNode,
    type EnrichedBlockAdditionalCharts,
    type EnrichedBlockAside,
    type EnrichedBlockCallout,
    type EnrichedBlockChart,
    type EnrichedBlockChartStory,
    type EnrichedBlockExpandableParagraph,
    type EnrichedBlockGraySection,
    type EnrichedBlockHeading,
    type EnrichedBlockHorizontalRule,
    type EnrichedBlockHtml,
    type EnrichedBlockImage,
    type EnrichedBlockKeyInsights,
    type EnrichedBlockKeyInsightsSlide,
    type EnrichedBlockList,
    type EnrichedBlockMissingData,
    type EnrichedBlockNumberedList,
    type EnrichedBlockProminentLink,
    type EnrichedBlockPullQuote,
    type EnrichedBlockRecirc,
    type EnrichedBlockScroller,
    type EnrichedBlockSDGGrid,
    type EnrichedBlockSDGToc,
    type EnrichedBlockSideBySideContainer,
    type EnrichedBlockSimpleText,
    type EnrichedBlockStickyLeftContainer,
    type EnrichedBlockStickyRightContainer,
    type EnrichedBlockText,
    type EnrichedTopicPageIntroRelatedTopic,
    type EnrichedTopicPageIntroDownloadButton,
    type EnrichedBlockTopicPageIntro,
    type EnrichedChartStoryItem,
    type EnrichedRecircLink,
    type EnrichedScrollerItem,
    type EnrichedSDGGridItem,
    type EntryMeta,
    type EntryNode,
    EPOCH_DATE,
    type FilterFnPostRestApi,
    type FormattedPost,
    type FormattingOptions,
    type FullPost,
    GdocsContentSource,
    type GitCommit,
    GraphDocumentType,
    GraphType,
    type GridParameters,
    HorizontalAlign,
    IDEAL_PLOT_ASPECT_RATIO,
    type IndexPost,
    type Integer,
    JsonError,
    type KeyInsight,
    type KeyValueProps,
    type OwidGdocContent,
    type LinkedChart,
    OwidGdocPublicationContext,
    type OwidGdocErrorMessage,
    OwidGdocErrorMessageType,
    type OwidGdocLinkJSON,
    type OwidGdocInterface,
    type OwidGdocTag,
    OwidGdocType,
    type OwidGdocStickyNavItem,
    type OwidGdocJSON,
    type OwidGdocPublished,
    type OwidEnrichedGdocBlock,
    type OwidRawGdocBlock,
    type OwidArticleBackportingStatistics,
    type OwidVariableId,
    type ParseError,
    Position,
    type PositionMap,
    type PostReference,
    type PostRestApi,
    type PostRow,
    type PrimitiveType,
    type RawBlockAdditionalCharts,
    type RawBlockAside,
    type RawBlockCallout,
    type RawBlockChart,
    type RawBlockChartStory,
    type RawBlockChartValue,
    type RawBlockExpandableParagraph,
    type RawBlockGraySection,
    type RawBlockHeading,
    type RawBlockHorizontalRule,
    type RawBlockHtml,
    type RawBlockImage,
    type RawBlockKeyInsights,
    type RawBlockList,
    type RawBlockMissingData,
    type RawBlockNumberedList,
    type RawBlockPosition,
    type RawBlockProminentLink,
    type RawBlockPullQuote,
    type RawBlockRecirc,
    type RawBlockScroller,
    type RawBlockSDGGrid,
    type RawBlockSDGToc,
    type RawBlockSideBySideContainer,
    type RawBlockStickyLeftContainer,
    type RawBlockStickyRightContainer,
    type RawBlockText,
    type RawBlockTopicPageIntro,
    type RawBlockUrl,
    type RawChartStoryValue,
    type RawRecircLink,
    type RawDetail,
    type RawSDGGridItem,
    type RelatedChart,
    ScaleType,
    type SerializedGridProgram,
    SiteFooterContext,
    SortBy,
    type SortConfig,
    SortOrder,
    type Span,
    type SpanBold,
    type SpanDod,
    type SpanFallback,
    type SpanItalic,
    type SpanLink,
    type SpanNewline,
    type SpanQuote,
    type SpanRef,
    type SpanSimpleText,
    type SpanSubscript,
    type SpanSuperscript,
    type SpanUnderline,
    SubNavId,
    SuggestedChartRevisionStatus,
    type Tag,
    type Time,
    type TimeBound,
    type TimeBounds,
    TimeBoundValue,
    type TimeRange,
    type TocHeading,
    type TocHeadingWithTitleSupertitle,
    type TopicId,
    type UnformattedSpan,
    type ValueRange,
    VerticalAlign,
    WP_BlockClass,
    WP_BlockType,
    WP_ColumnStyle,
    WP_PostType,
    type Year,
    type PostRowWithGdocPublishStatus,
    ToleranceStrategy,
    type RawPageview,
    type DataPageGdocContent,
    DataPageJsonTypeObject,
    type DataPageJson,
    type DataPageParseError,
    AllowedDataPageGdocFields,
} from "./owidTypes.js"

export {
    pairs,
    type NoUndefinedValues,
    type AllKeysRequired,
    type PartialBy,
    createFormatter,
    getRelativeMouse,
    exposeInstanceOnWindow,
    makeSafeForCSS,
    formatDay,
    formatYear,
    numberMagnitude,
    roundSigFig,
    first,
    last,
    excludeNull,
    excludeNullish,
    excludeUndefined,
    firstOfNonEmptyArray,
    lastOfNonEmptyArray,
    mapToObjectLiteral,
    next,
    previous,
    domainExtent,
    cagr,
    makeAnnotationsSlug,
    slugify,
    slugifySameCase,
    guid,
    TESTING_ONLY_reset_guid,
    pointsToPath,
    sortedFindClosestIndex,
    sortedFindClosest,
    isMobile,
    isTouchDevice,
    type Json,
    csvEscape,
    urlToSlug,
    trimObject,
    fetchText,
    getCountryCodeFromNetlifyRedirect,
    stripHTML,
    getRandomNumberGenerator,
    sampleFrom,
    getIdealGridParams,
    findClosestTimeIndex,
    findClosestTime,
    es6mapValues,
    type DataValue,
    valuesByEntityAtTimes,
    valuesByEntityWithinTimes,
    getStartEndValues,
    dateDiffInDays,
    diffDateISOStringInDays,
    getYearFromISOStringAndDayOffset,
    addDays,
    parseIntOrUndefined,
    anyToString,
    scrollIntoViewIfNeeded,
    rollingMap,
    groupMap,
    keyMap,
    linkify,
    oneOf,
    intersectionOfSets,
    unionOfSets,
    differenceOfSets,
    isSubsetOf,
    intersection,
    sortByUndefinedLast,
    mapNullToUndefined,
    lowerCaseFirstLetterUnlessAbbreviation,
    sortNumeric,
    mapBy,
    findIndexFast,
    logMe,
    getClosestTimePairs,
    omitUndefinedValues,
    omitNullableValues,
    isInIFrame,
    differenceObj,
    findDOMParent,
    wrapInDiv,
    textAnchorFromAlign,
    dyFromAlign,
    values,
    stringifyUnknownError,
    toRectangularMatrix,
    checkIsPlainObjectWithGuard,
    checkIsStringIndexable,
    triggerDownloadFromBlob,
    triggerDownloadFromUrl,
    removeAllWhitespace,
    moveArrayItemToIndex,
    getIndexableKeys,
    retryPromise,
    getOwidGdocFromJSON,
    formatDate,
    canWriteToClipboard,
    isNegativeInfinity,
    isPositiveInfinity,
    imemo,
    recursivelyMapArticleContent,
    traverseEnrichedBlocks,
    checkNodeIsSpan,
    spansToUnformattedPlainText,
    findDuplicates,
    checkIsOwidGdocType,
    isArrayOfNumbers,
    greatestCommonDivisor,
    findGreatestCommonDivisorOfArray,
    type NodeWithUrl,
} from "./Util.js"

export {
    capitalize,
    chunk,
    clone,
    cloneDeep,
    compact,
    countBy,
    debounce,
    difference,
    drop,
    extend,
    findLastIndex,
    flatten,
    get,
    groupBy,
    identity,
    invert,
    isArray,
    isBoolean,
    isEmpty,
    isEqual,
    isNull,
    isNumber,
    isString,
    isUndefined,
    keyBy,
    mapValues,
    max,
    maxBy,
    memoize,
    min,
    minBy,
    noop,
    omit,
    once,
    orderBy,
    partition,
    pick,
    range,
    reverse,
    round,
    sample,
    sampleSize,
    set,
    sortBy,
    sortedUniqBy,
    startCase,
    sum,
    sumBy,
    takeWhile,
    throttle,
    toString,
    union,
    unset,
    uniq,
    uniqBy,
    uniqWith,
    upperFirst,
    without,
    zip,
    lowercaseObjectKeys,
} from "./Util.js"

export { isPresent } from "./isPresent.js"

import dayjs from "./dayjs.js"
export { dayjs }

export type {
    Dayjs,
    customParseFormatType,
    relativeTimeType,
    utcType,
} from "./dayjs.js"

export type { OwidSource } from "./OwidSource.js"
export {
    formatValue,
    checkIsVeryShortUnit,
    type TickFormattingOptions,
} from "./formatValue.js"

export {
    timeFromTimebounds,
    minTimeBoundFromJSONOrNegativeInfinity,
    maxTimeBoundFromJSONOrPositiveInfinity,
    minTimeToJSON,
    maxTimeToJSON,
    timeBoundToTimeBoundString,
    getTimeDomainFromQueryString,
} from "./TimeBounds.js"

export {
    RegionType,
    regions,
    type Region,
    countries,
    type Country,
    getCountryBySlug,
    getCountryDetectionRedirects,
    isCountryName,
    continents,
    type Continent,
    aggregates,
    type Aggregate,
    others,
} from "./regions.js"

export { getStylesForTargetHeight } from "./react-select.js"

export {
    type GridBounds,
    FontFamily,
    Bounds,
    DEFAULT_BOUNDS,
} from "./Bounds.js"

export {
    type Persistable,
    objectWithPersistablesToObject,
    updatePersistables,
    deleteRuntimeAndUnchangedProps,
} from "./persistable/Persistable.js"

export { PointVector } from "./PointVector.js"

export {
    OwidVariableDisplayConfig,
    type OwidVariableWithSource,
    type OwidVariableWithSourceAndDimension,
    type OwidVariableWithSourceAndDimensionWithoutId,
    type OwidVariableMixedData,
    type OwidVariableWithDataAndSource,
    type OwidVariableWithSourceAndType,
    type OwidVariableDimension,
    type OwidVariableDimensions,
    type OwidVariableDataMetadataDimensions,
    type MultipleOwidVariableDataDimensionsMap,
    type OwidVariableDimensionValuePartial,
    type OwidVariableDimensionValueFull,
    type OwidVariableTypeOptions,
    type OwidEntityKey,
} from "./OwidVariable.js"

export {
    type QueryParams,
    getQueryParams,
    getWindowQueryParams,
    strToQueryParams,
    queryParamsToStr,
    getWindowQueryStr,
    setWindowQueryStr,
} from "./urls/UrlUtils.js"

export { Url, setWindowUrl, getWindowUrl } from "./urls/Url.js"

export { type UrlMigration, performUrlMigrations } from "./urls/UrlMigration.js"

export {
    type GrapherConfigPatch,
    type BulkGrapherConfigResponseRow,
    type VariableAnnotationsResponseRow,
    type BulkChartEditResponseRow,
    type BulkGrapherConfigResponse,
    WHITELISTED_SQL_COLUMN_NAMES,
    variableAnnotationAllowedColumnNamesAndTypes,
    chartBulkUpdateAllowedColumnNamesAndTypes,
} from "./AdminSessionTypes.js"

export {
    setValueRecursiveInplace,
    setValueRecursive,
    compileGetValueFunction,
    applyPatch,
} from "./patchHelper.js"

export {
    EditorOption,
    FieldType,
    type FieldDescription,
    extractFieldDescriptionsFromSchema,
} from "./schemaProcessing.js"

export {
    type SExprAtom,
    type JSONPreciselyTyped,
    type JsonLogicContext,
    Arity,
    type OperationContext,
    type Operation,
    ExpressionType,
    BooleanAtom,
    NumberAtom,
    StringAtom,
    JsonPointerSymbol,
    SqlColumnName,
    ArithmeticOperator,
    allArithmeticOperators,
    ArithmeticOperation,
    NullCheckOperator,
    allNullCheckOperators,
    NullCheckOperation,
    EqualityOperator,
    allEqualityOperators,
    EqualityComparision,
    StringContainsOperation,
    ComparisonOperator,
    allComparisonOperators,
    NumericComparison,
    BinaryLogicOperators,
    allBinaryLogicOperators,
    BinaryLogicOperation,
    Negation,
    parseOperationRecursive,
    parseToOperation,
    NumericOperation,
    BooleanOperation,
    StringOperation,
} from "./SqlFilterSExpression.js"

export {
    type SearchWord,
    buildSearchWordsFromSearchString,
    filterFunctionForSearchWords,
    highlightFunctionForSearchWords,
} from "./search.js"

export { findUrlsInText, camelCaseProperties } from "./string.js"

export { serializeJSONForHTML, deserializeJSONFromHTML } from "./serializers.js"

export { PromiseCache } from "./PromiseCache.js"

export { PromiseSwitcher } from "./PromiseSwitcher.js"

export {
    getSizes,
    generateSrcSet,
    getFilenameWithoutExtension,
    getFilenameAsPng,
    type GDriveImageMetadata,
    type ImageMetadata,
} from "./image.js"

export { Tippy, TippyIfInteractive } from "./Tippy.js"

export { TextWrap, shortenForTargetWidth } from "./TextWrap/TextWrap.js"

export {
    MarkdownTextWrap,
    sumTextWrapHeights,
} from "./MarkdownTextWrap/MarkdownTextWrap.js"

export {
    extractDetailsFromSyntax,
    mdParser,
} from "./MarkdownTextWrap/parser.js"

export {
    gdocUrlRegex,
    detailOnDemandRegex,
    getLinkType,
    getUrlTarget,
    checkIsInternalLink,
    convertHeadingTextToId,
} from "./GdocsUtils.js"

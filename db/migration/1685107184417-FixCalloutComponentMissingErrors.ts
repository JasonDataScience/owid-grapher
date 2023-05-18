import { MigrationInterface, QueryRunner } from "typeorm"
import { Gdoc } from "../model/Gdoc/Gdoc.js"
import { cloneDeep, forEach, forOwn, isArray, isObject } from "lodash"
export class FixCalloutComponentMissingErrors1685107184417
    implements MigrationInterface
{
    public async up(_queryRunner: QueryRunner): Promise<void> {
        // sanity check that the migration works
        recursivelyFixCalloutComponents(testItemBefore)
        if (JSON.stringify(testItemBefore) !== JSON.stringify(expectedAfter)) {
            throw new Error(
                "The migration did not work as expected. Please check the code."
            )
        }

        // Now run the migration over all gdocs
        const allGdocs = await Gdoc.find()
        for (const gdoc of allGdocs) {
            const old = cloneDeep(gdoc.content.body)
            recursivelyFixCalloutComponents(gdoc.content.body)
            if (JSON.stringify(old) !== JSON.stringify(gdoc.content.body)) {
                console.log(`Updating callout component in gdoc ${gdoc.slug}`)
                await gdoc.save()
            }
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        console.log("This migration is not currently reversible.")
    }
}
function recursivelyFixCalloutComponents(node: any): void {
    if (isArray(node)) {
        // If the argument is an array, iterate over its elements.
        forEach(node, (item) => {
            recursivelyFixCalloutComponents(item)
        })
    } else if (isObject(node)) {
        if (
            "type" in node &&
            node.type === "callout" &&
            "text" in node &&
            isArray(node.text)
        ) {
            for (const textNode of node.text) {
                if (!("parseErrors" in textNode)) {
                    textNode.parseErrors = []
                }
            }
        }
        // If the argument is an object, iterate over its keys.
        forOwn(node, (value) => {
            // Recurse on the key's value.
            recursivelyFixCalloutComponents(value)
        })
    }
}
// The callout component changed and now has an array of text nodes instead of an array of spans arrays.
// Here are two example values of before and after
const testItemBefore = {
    text: [
        {
            type: "text",
            value: [
                {
                    children: [
                        {
                            text: "This article was restructured and shortened in March 2023.",
                            spanType: "span-simple-text",
                        },
                    ],
                    spanType: "span-italic",
                },
            ],
        },
        { type: "text", value: [] },
    ],
    type: "callout",
    parseErrors: [],
}

const expectedAfter = {
    text: [
        {
            type: "text",
            value: [
                {
                    children: [
                        {
                            text: "This article was restructured and shortened in March 2023.",
                            spanType: "span-simple-text",
                        },
                    ],
                    spanType: "span-italic",
                },
            ],
            parseErrors: [],
        },
        { type: "text", value: [], parseErrors: [] },
    ],
    type: "callout",
    parseErrors: [],
}
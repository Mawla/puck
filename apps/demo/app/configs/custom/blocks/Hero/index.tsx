/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";
import { getClassNameFactory } from "@measured/puck/lib";
import { Button } from "@measured/puck/components/Button";
import { Section } from "../../components/Section";
import { quotes } from "./quotes";
import { Heading as HeadingEditor } from "../Heading";
import { Heading } from "@measured/puck/components/Heading";

const getClassName = getClassNameFactory("Hero", styles);

export type HeroProps = {
  _data?: object;
  title: string;
  description: string;
  align?: string;
  padding: string;
  imageMode?: "inline" | "background";
  imageUrl?: string;
  buttons: {
    label: string;
    href: string;
    variant?: "primary" | "secondary"
  }[];
  headingTheme: object[];
  blockTheme: object[];
};

const quotesAdaptor = {
  name: "Quotes API",
  fetchList: async (): Promise<Partial<HeroProps>[]> =>
    quotes.map((quote) => ({
      title: quote.author,
      description: quote.content,
    })),
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    _data: {
      type: "external",
      adaptor: quotesAdaptor,
      getItemSummary: (item: Partial<HeroProps>) => item.description,
    },
    title: {type: "text"},
    description: {type: "textarea"},
    buttons: {
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: {type: "text"},
        href: {type: "text"},
        variant: {
          type: "select",
          options: [
            {label: "primary", value: "primary"},
            {label: "secondary", value: "secondary"},
          ],
        },
      },
    },
    headingTheme: {
      type: "object",
      objectFields: {
        ...HeadingEditor.fields,
      }
    },
    blockTheme: {
      type: "object",
      objectFields: {
        color: "fafafa"
      }
    },
    align: {
      type: "radio",
      options: [
        {label: "left", value: "left"},
        {label: "center", value: "center"},
      ],
    },
    imageUrl: {type: "text"},
    imageMode: {
      type: "radio",
      options: [
        {label: "inline", value: "inline"},
        {label: "background", value: "background"},
      ],
    },
    padding: {type: "text"},
  },
  defaultProps: {
    title: "Title1",
    align: "left",
    description: "Description",
    buttons: [
      {
        label: "Learn more",
        href: "#"
      }
    ],
    // @ts-ignore
    headingTheme: {
      ...HeadingEditor.defaultProps
    },
    blockTheme: [ {
      color: "#fafafa",
      size: "H1"
    } ],
    padding: "64px",
  },
  render: ({
             align,
             title,
             description,
             buttons,
             padding,
             imageUrl,
             imageMode,
             headingTheme,
             blockTheme
           }) => {

    return (
      <Section
        padding={ padding }
        className={ getClassName({
          left: align === "left",
          center: align === "center",
          hasImageBackground: imageMode === "background",
        }) }
      >
        { imageMode === "background" && (
          <>
            <div
              className={ getClassName("image") }
              style={ {
                backgroundImage: `url("${ imageUrl }")`,
              } }
            ></div>

            <div className={ getClassName("imageOverlay") }></div>
          </>
        ) }

        <div className={ getClassName("inner") }>
          <div className={ getClassName("content") }>
            {/*@ts-ignore*/ }
            <Heading size={ headingTheme['size'] } rank={ headingTheme['level'] }>
              { title }
            </Heading>

            <p className={ getClassName("subtitle") }>{ description }</p>
            <div className={ getClassName("actions") }>
              { buttons.map((button, i) => (
                <Button
                  key={ i }
                  href={ button.href }
                  variant={ button.variant }
                  size="large"
                >
                  { button.label }
                </Button>
              )) }
            </div>
          </div>

          { align !== "center" && imageMode !== "background" && imageUrl && (
            <div
              style={ {
                backgroundImage: `url('${ imageUrl }')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderRadius: 24,
                height: 356,
                marginLeft: "auto",
                width: "100%",
              } }
            />
          ) }
        </div>
      </Section>
    );
  },
};

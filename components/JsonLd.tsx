interface JsonLdProps {
  readonly data: Record<string, unknown>;
}

/** Renders structured data safely: `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

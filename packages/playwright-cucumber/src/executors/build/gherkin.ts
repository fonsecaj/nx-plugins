import { AstBuilder, GherkinClassicTokenMatcher, Parser, compile } from "@cucumber/gherkin";
import { GherkinDocument, IdGenerator, Pickle } from "@cucumber/messages";
import { readFileSync } from 'fs-extra';

const uuidFn = IdGenerator.uuid();
const builder = new AstBuilder(uuidFn);
const matcher = new GherkinClassicTokenMatcher();
const parser = new Parser(builder, matcher);

export type GherkinDocumentWithPickles = GherkinDocument & { readonly pickles: readonly Pickle[] };

export const parseGherkin = async (filePath: string): Promise<GherkinDocumentWithPickles> => {
  const fileContent = readFileSync(filePath, 'utf8');

  const gherkinDocument = parser.parse(fileContent);
  const pickles = compile(gherkinDocument, filePath, uuidFn);
  
  return {
    ...gherkinDocument,
    pickles,
    uri: pickles[0]?.uri ?? '',
  };
}

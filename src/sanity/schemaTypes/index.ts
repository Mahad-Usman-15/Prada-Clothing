import { type SchemaTypeDefinition } from 'sanity'
import { blogschema } from './blog'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogschema],
}

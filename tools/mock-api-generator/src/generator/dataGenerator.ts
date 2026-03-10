import { faker } from '@faker-js/faker';
import { ParsedProperty, ParsedType } from '../parser/typeParser';

// Maps a property name and type to a sensible fake value.
// We first try to match by property name (e.g. "email" → fake email)
// before falling back to the raw type category.
function generateValue(property: ParsedProperty): unknown {
  const nameLower = property.name.toLowerCase();

  // Name-based heuristics — these give much more realistic output than
  // generating a random string for every string field.
  if (nameLower === 'id' || nameLower.endsWith('id')) return faker.string.uuid();
  if (nameLower === 'email') return faker.internet.email();
  if (nameLower === 'name' || nameLower === 'fullname' || nameLower === 'full_name')
    return faker.person.fullName();
  if (nameLower === 'firstname' || nameLower === 'first_name') return faker.person.firstName();
  if (nameLower === 'lastname' || nameLower === 'last_name') return faker.person.lastName();
  if (nameLower === 'username') return faker.internet.username();
  if (nameLower === 'password') return faker.internet.password();
  if (nameLower === 'phone' || nameLower === 'phonenumber' || nameLower === 'phone_number')
    return faker.phone.number();
  if (nameLower === 'address') return faker.location.streetAddress();
  if (nameLower === 'city') return faker.location.city();
  if (nameLower === 'country') return faker.location.country();
  if (nameLower === 'zipcode' || nameLower === 'zip' || nameLower === 'postcode')
    return faker.location.zipCode();
  if (nameLower === 'url' || nameLower === 'website') return faker.internet.url();
  if (nameLower === 'avatar' || nameLower === 'image' || nameLower === 'photo')
    return faker.image.avatar();
  if (nameLower === 'description' || nameLower === 'bio' || nameLower === 'summary')
    return faker.lorem.sentence();
  if (nameLower === 'title') return faker.lorem.words(3);
  if (nameLower === 'price' || nameLower === 'amount' || nameLower === 'cost')
    return parseFloat(faker.commerce.price());
  if (nameLower === 'age') return faker.number.int({ min: 18, max: 80 });
  if (
    nameLower === 'createdat' ||
    nameLower === 'created_at' ||
    nameLower === 'updatedat' ||
    nameLower === 'updated_at'
  ) {
    return faker.date.past().toISOString();
  }
  if (nameLower === 'active' || nameLower === 'enabled' || nameLower === 'verified')
    return faker.datatype.boolean();
  if (nameLower === 'role') return faker.helpers.arrayElement(['admin', 'user', 'moderator']);
  if (nameLower === 'status') return faker.helpers.arrayElement(['active', 'inactive', 'pending']);

  // Fall back to type-based generation
  switch (property.type) {
    case 'number':
      return faker.number.int({ min: 1, max: 1000 });
    case 'boolean':
      return faker.datatype.boolean();
    case 'date':
      return faker.date.past().toISOString();
    case 'array':
      return [];
    default:
      return faker.lorem.word();
  }
}

// Generates a single fake object for a given parsed type.
export function generateObject(parsedType: ParsedType): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const property of parsedType.properties) {
    obj[property.name] = generateValue(property);
  }
  return obj;
}

// Generates an array of fake objects for a given parsed type.
export function generateList(parsedType: ParsedType, count = 5): Record<string, unknown>[] {
  return Array.from({ length: count }, () => generateObject(parsedType));
}

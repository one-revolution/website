### Project Development Guidelines

These notes are for the project development team & contributors to work efficiently together, on this project
using Nuxt 4, Vue 3, TypeScript, and Nuxt UI components to develop a web application for the 
one revolution website.

### Project Brief

One Revolution is a platform that is nostr client, enable users to read long form articles and 
share their thoughts and opinions. The platform aims to provide a user-friendly and engaging experience, 
with a focus on content long-form creation and sharing.

### Build/Configuration Instructions

1. **Install dependencies**:
   Ensure you have `pnpm` installed, then run:
   ```bash
   pnpm install
   ```

2. **Development Server**:
   Start the development server with Hot Module Replacement (HMR):
   ```bash
   pnpm dev
   ```

3. **Production Build**:
   Build the application for production:
   ```bash
   pnpm build
   ```
   Preview the production build locally:
   ```bash
   pnpm preview
   ```

### Testing Information

We use [Vitest](https://vitest.dev/) with [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) for unit and component testing.

#### Running Tests

- **Run all tests**:
  ```bash
  pnpm test
  ```
- **Run tests in UI mode**:
  ```bash
  pnpm test -- --ui
  ```

#### Adding New Tests

1. Create a `.test.ts` file alongside the file you want to test (e.g., `app/utils/math.test.ts`).
2. Use `describe`, `it`/`test`, and `expect` from `vitest`.
3. If the test requires the Nuxt environment (e.g., for composables or components), ensure `vitest.config.ts` is configured with `environment: 'nuxt'`.

#### Example Test

Here is a simple test for a utility function:

```typescript
// app/utils/index.test.ts
import { describe, it, expect } from 'vitest'
import { randomInt } from './index'

describe('randomInt', () => {
  it('should return a number within the specified range', () => {
    const min = 1
    const max = 10
    const result = randomInt(min, max)
    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThanOrEqual(max)
  })
})
```

### Additional Development Information

- **Code Style**:
  - The project follows the [Nuxt ESLint](https://eslint.nuxt.com/) configuration.
  - Key stylistic rules: No comma dangles, 1TBS brace style.
  - Linting can be performed with `pnpm lint`.
  - Type checking can be performed with `pnpm typecheck`.

- **UI Components**:
  - Built with Nuxt UI (v4). Refer to the [Nuxt UI documentation](https://ui.nuxt.com) for component usage.

- **Nostr Integration**:
  - The project uses `@nostr-dev-kit/ndk` for interacting with the Nostr protocol.
  - Follow NIP-23 for long-form content and NIP-22 (kind 1111) for comments.

nostr is a decentralized, open-source, and censorship-resistant social network protocol. It allows users to create and
share content in the form of posts, similar to traditional social media platforms, but with a focus on decentralization,
privacy, and free speech. 

NIP-23 is a standard for posting content on nostr.

NIP-23
======

Long-form Content
-----------------

`draft` `optional`

This NIP defines `kind:30023` (an _addressable event_) for long-form text content, generally referred to as "articles" or "blog posts". `kind:30024` has the same structure as `kind:30023` and is used to save long form drafts.

"Social" clients that deal primarily with `kind:1` notes should not be expected to implement this NIP.

### Format

The `.content` of these events should be a string text in Markdown syntax. To maximize compatibility and readability between different clients and devices, any client that is creating long form notes:

- MUST NOT hard line-break paragraphs of text, such as arbitrary line breaks at 80 column boundaries.

- MUST NOT support adding HTML to Markdown.

### Metadata

For the date of the last update the `.created_at` field should be used, for "tags"/"hashtags" (i.e. topics about which the event might be of relevance) the `t` tag should be used.

Other metadata fields can be added as tags to the event as necessary. Here we standardize 4 that may be useful, although they remain strictly optional:

- `"title"`, for the article title
- `"image"`, for a URL pointing to an image to be shown along with the title
- `"summary"`, for the article summary
- `"published_at"`, for the timestamp in unix seconds (stringified) of the first time the article was published

### Editability

These articles are meant to be editable, so they should include a `d` tag with an identifier for the article. Clients should take care to only publish and read these events from relays that implement that. If they don't do that they should also take care to hide old versions of the same article they may receive.

### Linking

The article may be linked to using the [NIP-19](19.md) `naddr` code along with the `a` tag.

### References

References to other Nostr notes, articles or profiles must be made according to [NIP-27](27.md), i.e. by using [NIP-21](21.md) `nostr:...` links and optionally adding tags for these (see example below).

## Example Event

```json
{
  "kind": 30023,
  "created_at": 1675642635,
  "content": "Lorem [ipsum][nostr:nevent1qqst8cujky046negxgwwm5ynqwn53t8aqjr6afd8g59nfqwxpdhylpcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mg8arnc9] dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nRead more at nostr:naddr1qqzkjurnw4ksz9thwden5te0wfjkccte9ehx7um5wghx7un8qgs2d90kkcq3nk2jry62dyf50k0h36rhpdtd594my40w9pkal876jxgrqsqqqa28pccpzu.",
  "tags": [
    ["d", "lorem-ipsum"],
    ["title", "Lorem Ipsum"],
    ["published_at", "1296962229"],
    ["t", "placeholder"],
    ["e", "b3e392b11f5d4f28321cedd09303a748acfd0487aea5a7450b3481c60b6e4f87", "wss://relay.example.com"],
    ["a", "30023:a695f6b60119d9521934a691347d9f78e8770b56da16bb255ee286ddf9fda919:ipsum", "wss://relay.nostr.org"]
  ],
  "pubkey": "...",
  "id": "..."
}
```

### Replies & Comments

Replies to `kind 30023` MUST use [NIP-22](./22.md) `kind 1111` comments. 

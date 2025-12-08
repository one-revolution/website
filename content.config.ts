import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
    title: z.string(),
    description: z.optional(z.string()),
})
const createImageSchema = () => z.object({
    src: z.string().editor({ input: 'media' }),
    alt: z.string()
})

const createButtonSchema = () => z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
    variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
    target: z.enum(['_blank', '_self']).optional()
})

const createSeoSchema = () => z.object({
    title: z.string(),
    description: z.string()
})
const createAuthorSchema = () => z.object({
    name: z.string(),
    description: z.string().optional(),
    username: z.string().optional(),
    to: z.string().optional(),
    avatar: createImageSchema().optional()
})
const createDocumentSchema = createBaseSchema().extend({
    short: z.string(),
    bannerImage: z.object({url: z.string(), alt: z.string()}),
    productImage: z.object({url: z.string(), alt: z.string()}),
    date: z.date(),
    tags: z.array(z.string()),
    summary: z.string(),
    author: z.string(),
    category: z.string(),
    slug: z.string(),
    order: z.number(),
    icon: z.string(),
    root: z.string()
})

export default defineContentConfig({
    collections: {
        posts: defineCollection({
                type: 'page',
                schema: z.object({
                    subtitle: z.string(),
                    featureImage: z.object({url: z.string(), alt: z.string()}),
                    date: z.date(),
                    tags: z.array(z.string()),
                    summary: z.string(),
                    author: createAuthorSchema(),
                    category: z.string(),

                }),
                source: {
                    repository: 'https://github.com/one-revolution/content',
                    include: 'posts/**',
                    authToken: process.env.GITHUB_CONTENT_TOKEN,
                }
            }
        ),
        books: defineCollection({
                type: 'page',
                schema: z.object({
                    subtitle: z.string(),
                    featureImage: z.object({url: z.string(), alt: z.string()}),
                    date: z.date(),
                    tags: z.array(z.string()),
                    summary: z.string(),
                    author: createAuthorSchema(),
                    type: z.string(),
                    affiliate: z.string(),
                    genre: z.string(),
                    image:z.string(),
                    bookAuthor: z.string(),
                }),
                source: {
                    repository: 'https://github.com/one-revolution/content',
                    include: 'reviews/books/**',
                    authToken: process.env.GITHUB_CONTENT_TOKEN,
                }
            }
        ),
        pages: defineCollection({
            type: 'page',
            source: 'index.yml',
            schema: z.object({
                seo: createSeoSchema(),
                hero: z.object({
                    links: z.array(createButtonSchema()),
                    images: z.array(createImageSchema())
                }),
                about: createBaseSchema().extend({
                    link: z.object({
                        label: z.string(),
                        to: z.string()
                    })
                }),
                experience: createBaseSchema().extend({
                    items: z.array(z.object({
                        date: z.date(),
                        position: z.string(),
                        company: z.object({
                            name: z.string(),
                            url: z.string(),
                            logo: z.string().editor({ input: 'icon' }),
                            color: z.string()
                        })
                    }))
                }),
            })
        }),
        about: defineCollection({
            type: 'page',
            source: 'about.yml',
            schema: createBaseSchema().extend({
                introduction: z.object({}),
                skills: z.object({
                    category: z.string(),
                    technologies: z.array( z.object({
                        name: z.string(),
                        icon: z.string(),
                        level: z.string()
                    }))
                })
            })
        }),
        products: defineCollection({
            type: 'page',
            schema: createDocumentSchema.extend({
                version: z.string(),
                versionDate: z.string(),
                heading: z.string()
            }),
            source: {
                repository: 'https://github.com/one-revolution/content',
                include: 'products/**',
                authToken: process.env.GITHUB_CONTENT_TOKEN,
            }
        })
    },
})

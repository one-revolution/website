// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    content: {
        build: {
            markdown: {
                highlight: {
                    theme: {
                        default: 'github-light',
                        dark: 'monokai',
                        sepia: 'monokai'
                    },
                    langs: [
                        'xml',
                        'csharp',
                        'typescript',
                        'javascript',
                        'yaml',
                        'shell',
                        'rust',
                        'go',
                        'python',
                        'terraform',
                        'json'
                    ]
                }
            }
        },
        experimental: {nativeSqlite: true},

    },
    modules: [
        '@nuxt/content',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/test-utils',
        '@nuxt/ui',
        '@nuxt/fonts',
    ],
    fonts: {
        providers: {
            bunny: false
        }
    },
    css: ['~/assets/css/main.css'],
    image: {
        provider: 'cloudinary',
        cloudinary: {
            baseURL: 'https://res.cloudinary.com/threenine-co-uk/image/upload/'
        }
    },
})
const config = {
    api: {
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
        fileUrl: `${import.meta.env.VITE_FILE_URL}`,
        timeout: 10000,
    },
    author: 'group_buy@email.com',
    site_name: 'Group Buy Admin',
}

export default config;
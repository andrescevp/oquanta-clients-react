const api_url = process.env.REACT_APP_BACKEND_API_URL || '';
export const settings = {
    apiBasePath: api_url || '',
    apiClientBaseConfig: {
        basePath: api_url || '',
        isJsonMime: () => true,
    },
};

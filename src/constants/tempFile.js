var baseUrl;
export const setBaseUrl = (base: any) => {
    baseUrl = base;
};

export const getBaseUrl = () => {
    console.log('DATAXX', baseUrl.data.base_url);
    return baseUrl.data.base_url;
};

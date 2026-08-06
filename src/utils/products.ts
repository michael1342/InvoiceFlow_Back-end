const { PRODUCT_STATUS } = require('../config/constants')

const skuGenerator = () => {
    let random = Math.floor(10000 + Math.random() * 40000);
    const sku = `sku-${random}`
    return sku
}

const getProductStatus = (quantity: number) => {
    if(quantity === 0) {
        return PRODUCT_STATUS.OUT_OF_STOCK
    } 
    if(quantity <= 30) {
        return PRODUCT_STATUS.LOW_STOCK
    }
    return PRODUCT_STATUS.IN_STOCK
}

module.exports = { skuGenerator, getProductStatus }
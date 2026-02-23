import { API } from "aws-amplify";
import config from "config";

function ProductException(message, data) {
  this.message = message;
  this.name = "Product Exception";
  if (data) {
    this.data = data
  }
}

export async function getProduct(productId) {
  try {
    return await API.get("products", `/products/${productId}`, {});
  } catch (e) {
    console.log(e)
  }
}

export async function listProducts(params) {
  let pageSize;
  let startToken;
  if (params.pageSize) {
    pageSize = params.pageSize
  } else {
    pageSize = 500
  }
  if (params.startToken) {
    startToken = params.startToken
  } else {
    startToken = null
  }
  try {
    let res = await API.get("products", "/products", {
      queryStringParameters: {
        pageSize: pageSize,
        startToken: startToken,
      }
    });
    return res.Items
  } catch (e) {
    console.log(e)
  }
}

export async function createProduct(productBody) {
  if (!productBody.name) {
    throw new ProductException("Create product failed. No product.name", productBody)
  } else if (!productBody.shortDescription) {
    throw new ProductException("Create product failed. No product.shortDescription", productBody)
  } else if (!productBody.longDescription) {
    throw new ProductException("Create product failed. No product.longDescription", productBody)
  } else if (!productBody.prices) {
    throw new ProductException("Create product failed. No product.prices", productBody)
  } else {
    config.currencies.forEach(currency => {
      if (productBody.prices.findIndex(price => price.currency === currency.code) === -1 || undefined) {
        throw new ProductException("Create product failed. product.prices array contains no " + currency.code + " value", productBody)
      }
    })
  }
  try {
    return API.post("products", "/products", {
      body: productBody
    });
  } catch (e) {
    console.log(e)
  }
}

export async function countProducts() {
  try {
    return await API.get("products", "/products", {
      queryStringParameters: {
        Select: "COUNT"
      }
    })
  } catch (e) {
    console.log(e)
  }
}

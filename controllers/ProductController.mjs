import database from "../config/database.mjs";

export const getAllProduct = async (req, res, next) => {
  try {
    const [products] = await database.query(`
      SELECT p.*,
          c.name AS category_name,
          c.slug AS category_slug,
          i.image_url AS product_image_url,
          i.image_path AS product_image_path
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN images i ON p.id = i.product_id
      `)
    res.status(200).json(
      {
        message: 'ok',
        data: products
      }
    )
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products.',
      error: error
    })
  }
}

export const getProductById = async (req, res, next) => {
  const {id} = req.params
  try {
    const [product] = await database.query(`
      SELECT p.*,
          c.name AS category_name,
          c.slug AS category_slug,
          i.image_url AS product_image_url,
          i.image_path AS product_image_path
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN images i ON p.id = i.product_id WHERE p.id = ?
      `, [id])

    if(product.length === 0) {
      return res.status(404).json({
        message: "Product not found."
      })
    }

    res.status(200).json(
      {
        message: 'ok',
        data: product[0]
      }
    )
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching product.',
      error: error
    })
  }
}

export const getProductBySlug = async (req, res, next) => {
  const {slug} = req.params
  try {
    const [product] = await database.query(`
      SELECT p.*,
          c.name AS category_name,
          c.slug AS category_slug,
          i.image_url AS product_image_url,
          i.image_path AS product_image_path
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN images i ON p.id = i.product_id WHERE p.slug = ?
      `, [slug])

    if(product.length === 0) {
      return res.status(404).json({
        message: "Product not found."
      })
    }

    res.status(200).json(
      {
        message: 'ok',
        data: product[0]
      }
    )
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching product.',
      error: error
    })
  }
}

const router = require('express').Router();
const InventoryController = require('../controllers/inventory.controller');
const { Protect, InventoryOnly } = require('../middleware/auth');

router.post('/add-product', Protect, InventoryOnly, InventoryController.addProduct);
router.get('/get-products', Protect, InventoryOnly, InventoryController.getProducts);
router.get('/get-product/:id', Protect, InventoryOnly, InventoryController.getProductById);
router.patch('/update-product/:id', Protect, InventoryOnly, InventoryController.updateProduct);
router.delete('/delete-product/:id', Protect, InventoryOnly, InventoryController.deleteProduct);
router.get('/stock', Protect, InventoryOnly, InventoryController.getChartData);

module.exports = router;
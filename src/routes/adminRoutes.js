const express = require("express");
const upload = require("../middlewares/multerConfig")
const { authMiddleware, authorize } = require("../middlewares/auth.middlewares");
const {
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../controllers/adminController");
const{
  loginDashboard
} = require("../controllers/authController")

const {
  createMainCategory,
  createSubCategory,
  updateMainCategory,
  updateSubCategory,
  deleteMainCategory,
  deleteSubCategory,

} = require("../controllers/categoryController");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const {  deleteReview , getReviewsByProduct } = require('../controllers/productReviewController');

const {
  getAllWebSiteReviews,
  approveSiteReview,
  deleteSiteReview,
} =require ("../controllers/webSitReviewController.js");

const
{
 createFAQ ,
 getAllFAQs,
 updateFAQ ,
 deleteFAQ
} =require("../controllers/faqController")


const router = express.Router();

// ================== Auth_Controller ==================

// Login_Dashboard
router.post("/login",loginDashboard)

//================== Admin_Controller  ==================

// get_all_users
router.get("/users", authMiddleware, authorize(["admin"]), getAllUsers);
// Delete_User_ById
router.delete("/users/:id", authMiddleware, authorize(["admin"]), deleteUser);
// Update_User_ById
router.patch("/users/:id", authMiddleware, authorize(["admin"]), updateUser);

// ================== Category_Controller ==================

// Creat_MainCategory 
router.post("/main",authMiddleware, authorize(["admin"]),  upload.single("image"), createMainCategory);
// Update_MainCategory
router.patch("/main/:id",authMiddleware, authorize(["admin"]),  upload.single("image"), updateMainCategory);
// Delete_MainCategory
router.delete("/main/:id",authMiddleware, authorize(["admin"]),  deleteMainCategory);

// Creat_SubCategory
router.post("/sub",authMiddleware, authorize(["admin"]), upload.single("image"), createSubCategory);
// Update_SubCategory_ById
router.patch("/sub/:id",authMiddleware, authorize(["admin"]), upload.single("image"), updateSubCategory);
// Delete_SubCategory_ById
router.delete("/sub/:id",authMiddleware, authorize(["admin"]), deleteSubCategory);
 
// ================== Product_Controller ==================
// Creat_Product
router.post('/pro',authMiddleware, authorize(["admin"]), upload.single('image'), createProduct);

// Update_product
router.patch('/pro/:id',authMiddleware, authorize(["admin"]), upload.single('image'), updateProduct);

// Delete_Product
router.delete('/pro/:id',authMiddleware, authorize(["admin"]), deleteProduct);

// ================== reviewsProduct_Controller ==================

// delete reviews by id
router.delete('/:id',authMiddleware, authorize(["admin"]),  deleteReview);

// get reviews by product 
router.get('/productId/:productId',authMiddleware, authorize(["admin"]), getReviewsByProduct);

// ================== webSite_Controller ==================

router.get("/webReview",authMiddleware,authorize(["admin"]),getAllWebSiteReviews);

router.put("/webReview/:id",authMiddleware,authorize(["admin"]), approveSiteReview);

router.delete("/webReview/:id",authMiddleware,authorize(["admin"]), deleteSiteReview);

// ================== FAQ_Controller ==================

router.post("/faq" , authMiddleware ,authorize(["admin"]) , createFAQ);

router.put("/faq/:id" , authMiddleware ,authorize(["admin"]) , updateFAQ);

router.get("/faq",authMiddleware,authorize(["admin"]) , getAllFAQs);

router.delete("/faq/:id",authMiddleware,authorize(["admin"]) , deleteFAQ);

module.exports = router;

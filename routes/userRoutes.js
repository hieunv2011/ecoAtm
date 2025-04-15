const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteManyUsers,
} = require("../controller/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại (mặc định là 1)
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["operator", "admin", "viewer"]
 *         description: Vai trò của người dùng để lọc (tùy chọn)
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get("/", protect, restrictTo("admin"), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin cá nhân hoặc user khác (Admin hoặc chính chủ)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/:id", protect, getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["operator", "admin", "viewer"]
 *     responses:
 *       201:
 *         description: Người dùng đã được tạo
 *       400:
 *         description: Tên hoặc email đã tồn tại
 *       403:
 *         description: Không có quyền tạo người dùng
 */
router.post("/", protect, restrictTo("admin"), createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Cập nhật thông tin cá nhân hoặc user khác (Admin hoặc chính chủ)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã cập nhật
 *       403:
 *         description: Không có quyền chỉnh sửa
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.patch("/:id", protect, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

/**
 * @swagger
 * /users/delete-many:
 *   post:
 *     summary: Xóa nhiều người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền xóa
 */
router.post("/delete-many", protect, restrictTo("admin"), deleteManyUsers);

module.exports = router;

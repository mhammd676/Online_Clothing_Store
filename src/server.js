const app = require("../src/app");
const prisma = require("./config/db"); // ملف اتصال Prisma


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // اختبار الاتصال بقاعدة البيانات
    await prisma.$connect();
    console.log("Database connected successfully");

    // تشغيل السيرفر
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};



startServer();
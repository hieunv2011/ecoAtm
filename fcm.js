const admin = require("firebase-admin");
const serviceAccount = require("./firebase/firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (deviceToken, title, body) => {
  const message = {
    notification: { title, body },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Gửi thành công:", response);
  } catch (error) {
    console.error("Lỗi gửi thông báo:", error);
  }
};

// Gọi hàm với token thiết bị
const testToken = "do9nCnq3TAa2g-oLpJo3Xx:APA91bFJhvat5zxdgjb4jl1sGXIsTmFka18-HnLNwsLYkwCK-dZaD6AVoyOx4cLQjC5RKG03dEjf_AL_NW7FEEnFo-LXHBbivfrkeSQ2Nf789NGh74YCss0";
sendNotification(testToken, "Tiêu đề", "Nội dung thông báo");

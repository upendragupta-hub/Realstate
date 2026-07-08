require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateMany(
    { name: /upendra/i },
    { $set: { role: 'admin' } }
  );
  console.log('Updated users:', result.modifiedCount);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

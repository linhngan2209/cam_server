export default () => ({
    mongodb: {
      uri: process.env.MONGODB_URI || `mongodb+srv://nganptlhe160415:12345@cluster0.wwnmx21.mongodb.net/watergate?retryWrites=true&w=majority&appName=Cluster0`
    },
  });
  
export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || "apenas-um-test-sem-dotevn",
    expiresIn: '1d'
  }
}

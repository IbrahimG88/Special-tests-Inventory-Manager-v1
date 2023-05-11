// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/db";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.

        // You can also use an arbitrary data source to store your list of users
        // in the USERSLIST environment variable, a single user has 5 properties: id, name, email, password, role
        //const users = JSON.parse(process.env.USERSLIST);

        // Find a matching user based on their username and password
        const client = await connectToDatabase();
        const db = client.db("myFirstDatabase");

        const usersCollection = db.collection("users2");

        const user = await usersCollection.findOne({
          email: credentials.username,
          password: credentials.password,
        });

        if (!user) {
          return null;
        }
        return user;
      },
      jwt: true,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});

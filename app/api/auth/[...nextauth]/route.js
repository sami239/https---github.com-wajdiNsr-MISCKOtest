import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  // Security secret from your .env
  secret: process.env.NEXTAUTH_SECRET || 'tictaac123456wwaajjddii',

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('\n--- 1. AUTHORIZE CALLBACK ---')

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const apiUrl = 'https://auth.tirbiha.tn/api/users/login'

        try {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'tictaac121212WWww' // Your specific API Key
            },
            body: JSON.stringify({
              email: credentials.email,
              motdepass: credentials.password // ✅ FIXED: Backend expects 'motdepass'
            })
          })

          const responseData = await res.json()

          // LOG: See what your API is returning
          console.log('API Response Data:', responseData)

          if (!res.ok) {
            console.error('Authentication failed with status:', res.status)
            throw new Error(responseData.message || 'Authentication failed')
          }

          // Ensure the API returned the expected structure
          if (responseData.token && responseData.user) {
            const userObject = {
              // Main identifiers
              id: responseData.user._id,
              name: `${responseData.user.prenom} ${responseData.user.nom}`,
              email: responseData.user.email,
              accessToken: responseData.token, 

              // User details mapping
              nom: responseData.user.nom,
              prenom: responseData.user.prenom,
              telephone: responseData.user.telephone,
              profiles: responseData.user.id_profile,
              solde: responseData.user.solde,
              lang: responseData.user.lang,
              type: responseData.user.type,
              statut_compte: responseData.user.statut_compte,
              adresse: responseData.user.adresse,
              pays: responseData.user.pays,
              ville: responseData.user.ville,
              region: responseData.user.region,
              date_creation: responseData.user.date_creation
            }

            console.log('Authorize successful. User authenticated.')
            return userObject
          } else {
            console.warn('Authorize failed: token or user data was missing in API response.')
            return null
          }
        } catch (error) {
          console.error('Error in authorize callback:', error)
          throw new Error(error.message || 'An unexpected error occurred')
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // The `user` object is only passed on the first call (initial sign-in)
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
        token.nom = user.nom
        token.prenom = user.prenom
        token.telephone = user.telephone
        token.profiles = user.profiles
        token.solde = user.solde
        token.lang = user.lang
        token.type = user.type
        token.statut_compte = user.statut_compte
        token.adresse = user.adresse
        token.pays = user.pays
        token.ville = user.ville
        token.region = user.region
        token.date_creation = user.date_creation
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        // Mapping token back to the session object
        session.initialToken = token.accessToken
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          nom: token.nom,
          prenom: token.prenom,
          telephone: token.telephone,
          profiles: token.profiles,
          solde: token.solde,
          lang: token.lang,
          type: token.type,
          statut_compte: token.statut_compte,
          adresse: token.adresse,
          pays: token.pays,
          ville: token.ville,
          region: token.region,
          date_creation: token.date_creation
        }
      }
      return session;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/auth/error'
  },

  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
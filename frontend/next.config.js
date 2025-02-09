const path = require('path')

module.exports = {
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'http://localhost:8000/:path*',
          },
        ]
      },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
   output: "standalone"
}
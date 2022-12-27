<script>
export default {
  created() {
    console.log('redirect..')
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    console.log('redirect..')
    return h() // avoid warning message
  }
}
</script>

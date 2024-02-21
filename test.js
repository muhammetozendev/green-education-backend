function def() {
  console.log(new Error().stack)

}

function abc() {
  def()
}

abc()
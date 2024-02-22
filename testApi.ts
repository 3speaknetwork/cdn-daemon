import axios from 'axios'

async function main() {
  try {
    let response = await axios.post(`http://192.168.0.217:18080/hub/register`, {})
    console.log(response.data)
  } catch (e) {
    return 'Error in fetching ip information'
  }
}
main()

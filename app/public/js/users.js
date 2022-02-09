// 即時関数でモジュール化
const usersModule = (() =>{
    const BASE_URL = "http://localhost:3000/api/v1/users"

    // settings header
    const headers = new Headers()
    headers.set("Content-Type", "application/json")

    return {
        fetchAllUsers: async () => {
            const res = await fetch(BASE_URL)
            // JSONをJSで使えるようにパース
            const users = await res.json()

            for (let i=0; i < users.length; i++){
                const user = users[i]
                const body = `<tr>
                                <td><a href="edit.html?uid=${user.id}">${user.id}</a></td>
                                <td>${user.name}</td>
                                <td>${user.profile}</td>
                                <td>${user.date_of_birth}</td>
                                <td>${user.created_at}</td>
                                <td>${user.updated_at}</td>
                              </tr>`
                document.getElementById('users-list').insertAdjacentHTML('beforeend', body)
            }
        },
        fetchOneUser: async (uid) => {

            const res = await fetch(BASE_URL + "/" + uid)

            // JSONをJSで使えるようにパース
            const user = await res.json()
            console.log(user)

            document.getElementById('uid').value = user.id
            document.getElementById('name').value = user.name
            document.getElementById('profile').value = user.profile
            document.getElementById('date-of-birth').value = user.date_of_birth  
        },
        createUser: async () => {
            const name = document.getElementById("name").value
            const profile = document.getElementById("profile").value
            const dateOfBirth = document.getElementById("date-of-birth").value

            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth
            }

            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            })

            const resJson = await res.json()

            alert(resJson.status + ": " + resJson.message)
            window.location.href = "/"
        },

        editUser: async (uid) => {
            const name = document.getElementById("name").value
            const profile = document.getElementById("profile").value
            const dateOfBirth = document.getElementById("date-of-birth").value
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth
            }

            const res = await fetch(BASE_URL + "/" + uid, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(body)
            })

            const resJson = await res.json()

            alert(resJson.status + ": " + resJson.message)
            window.location.href = "/"
        },

        deleteUser: async (uid) => {
            const confirmation = window.confirm('このユーザを削除しますか？')

            if (!confirmation){
                return false
            }else{
                const res = await fetch(BASE_URL+"/"+uid,  {
                    method: "DELETE",
                })
                const resJson = await res.json()

                alert(resJson.status + ": " + resJson.message)
                window.location.href = "/"
            }


        }
    }
})()
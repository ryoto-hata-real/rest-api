const indexModule = (() => {
    //検索ボタンをクリックしたときのイベントリスナー
    document.getElementById('search-btn').addEventListener('click', () => {
        return searchModule.searchUsers()
    })

    // UserのfetchUsersメソッドを呼び出す
    return usersModule.fetchAllUsers()
})()


import { GithubApi } from "./GithubApi.js";

class GitBoard{
    constructor(mainBoard){
        this.mainBoard = document.querySelector(mainBoard)        
        
        this.loadAllUsers()
    }
    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.users))
    }

    loadAllUsers(){
        this.users= JSON.parse(localStorage.getItem('@github-favorites:')) || [] 
        this.empty()
        
    }
    async addUser(username){        
        try{
            
            const userExists = this.users.find(entry =>  username.toLowerCase() === entry.login.toLowerCase())

            if(userExists){
                throw new Error(`Usuário ${username} já é seu favorito `);
                return;
            }
    

        const user= await GithubApi.search(username)
       
        
        if(user.login === undefined){
            throw new Error(`O usuário: ${username} esta escrito certo?!!`)
        }

        this.users= [user,...this.users]
        this.update()
        this.save()

        }catch(error){
            alert(error.message)
        }
    }

    // D DELETE
    delete(users){
        const UserNotDeleted= this.users.filter(targetDelete => targetDelete.login !== users.login)

        this.users = UserNotDeleted
        
        this.empty()
        this.update()
        this.save()
     }

}

class GitBoardFavorites extends GitBoard{
    constructor(mainBoard){
        super(mainBoard)
        this.tBody = document.querySelector('tbody')
        this.searchUser()
        this.update()
    }

    searchUser(){
        const favorite = document.getElementById('favorite')
        const searching = document.getElementById('git-search')
        const favorited = () => {
            let {value} = searching
            this.addUser(value)
            

        }
            let enter = (key)=>{
                if(key.key == 'Enter'){
            favorited()
              
        }
      }
      
        favorite.addEventListener('click', ()=> favorited())
        searching.addEventListener('keypress',  (key) =>enter(key) )
        
    }
    update(){
           
            this.removeTrAll()
            this.users.map(user=>{
                
                const row = this.creatRowUser()

                row.querySelector('.user img').src = `https://github.com/${user.login}.png`
                row.querySelector('.user img').alt =`imagem de ${user.name}`
                row.querySelector('.user p').textContent = user.name
                row.querySelector('.user span').textContent = user.login
                row.querySelector('.repositories').textContent = user.public_repos
                row.querySelector('.followers').textContent = user.followers
                row.querySelector('.user a').href = `https://github.com/${user.login}`
                row.querySelector('.user a').target = `_blank`
            
                row.querySelector('#Desfavoritar').onclick = () =>{
                const confirmUnFavorite = confirm("Quer Desfavoritar esse Perfil Mesmo?")
                if(confirmUnFavorite){
    
                    this.delete(user)
                } }
                this.tBody.append(row)
            } )
           this.empty()
            
    }

    creatRowUser(){
        const tr = document.createElement('tr')

        const dataRow = 
        `
            <td class="user">
                <img src="https://github.com/patrick-cabelin.png" alt="">
                <a href="https://gituhub.com/patrick-cabelin">
                    <p>Patrick Alexsander</p>
                    <span>Patrick Cabelin</span>
                </a>
            </td>
            <td class="repositories">10</td>
            <td class="followers">0</td>
            
            <td>
                <button id="Desfavoritar">Desfavoritar</button>
            </td>
        `

        tr.innerHTML= dataRow
        return tr
    }
    
    removeTrAll(){
        let allTr = this.tBody.querySelectorAll('tr')
         allTr.forEach( (tr) =>
             tr.remove()
             
         )
    }
    empty(){
  
        const empty =document.getElementById('empty')
        if(this.users.length === 0){
            empty.style.display = 'flex'
   
            return
        }
        empty.style.display = 'none'
      

    }

}
new GitBoardFavorites('.app')


  
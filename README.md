## Base commands
### Migration commands
- reset all apllied migrations <br>
`python manage.py migrate main zero`
- add new empty migration <br>
`python manage.py makemigrations --empty main`
- check changes made in models/migrations <br>
`python manage.py makemigrations `
- aplly new migrations/ changes in migrations <br>
`python manage.py migrate `
### Application commands
- run app <br>
`python  manage.py runserver `
### Users commands
- create admin user <br>
`python manage.py createsuperuser`

## Workflow
### Branches
- Main branch is develop. From this branch we create feature branches and all other types of branches. When The project is done or we are confident that everything is work fine we can merge it to master.
### When feature branch is done
- When your job is done and you commited and pushed your all changes you should create pull request. Second person will check if everything is working fine and after that second person can merge your feature branch to develop.

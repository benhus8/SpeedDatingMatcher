## Speed Dating Event Management System 
This project is a collaboration between Django and Next.js frameworks, aimed at creating a comprehensive event management system tailored for speed dating events. The primary focus was to gain proficiency in both Django for backend development and Next.js for frontend implementation.

### Features:

- **Integration with Brevo:** Seamless email communication is facilitated through integration with Brevo, streamlining the process of sending emails to participants.
- **Azure Deployment:** The application has been successfully deployed on Microsoft Azure, where it underwent thorough testing and was utilized during a live speed dating event.
- **Email Validation:** In addition to managing event data, the system includes a feature for validating email addresses

### Technologies Used:

- **Django:** Utilized for robust backend development.
- **Next.js:** Leveraged for building the frontend interface.
- **Brevo Integration:** Integrated to manage email communication efficiently.
- **Microsoft Azure:** Chosen as the deployment platformn.

### Deployment Instructions:
To deploy the Speed Dating Event Management System locally, follow these steps:

#### Backend
- install all dependencies: `pip install -r requirements.txt` <br>
- create admin user `python manage.py createsuperuser` <br>
- create database and apply migrations `python manage.py migrate `
- run backend app `python  manage.py runserver `
 
#### Frontend
- go to `frontend` directory
- run `npm install` <br>
- run `npm run dev` <br>

#### Deploy
##### Change environment variables in settings.py
##### Change environment variable in .env in frontend
##### 
##### Run commands:
- docker-compose build
- docker-compose up -d
- docker-compose exec web python manage.py migrate
- docker-compose exec web python manage.py createsuperuser
### Contributors:
- [benhus8](https://github.com/benhus8)
- [Mattias988](https://github.com/Mattias988)

### License:
This project is licensed under the [MIT License], granting users the freedom to use, modify, and distribute the software as per the terms outlined in the license agreement.

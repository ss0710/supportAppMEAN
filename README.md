# supportApp
![alt text](https://user-images.githubusercontent.com/63851816/230056946-410f6c08-8148-4a2c-b039-d433efdf0d1f.png)

# Overview
The project is a support app that provides a platform for brands to manage customer support tickets efficiently.

1) The app is built on a multitenant architecture, which includes a hierarchy of users consisting of Superadmin, Brands, Brand Admin, Managers, and Agents. The Superadmin has the highest level of access and control over the entire system, while the Brands have their dedicated space to manage their support tickets.

2) The Managers are responsible for assigning and managing support tickets to Agents. They can view the status of the tickets and update them as necessary. The Managers have access to all the tickets assigned to their team members, and they can escalate them to higher-level support if needed.

3) The Brand Admins are responsible for creating Managers and Agents for their brand. They can also manage their brand's support settings, such as SLA policies, support channels, and automation rules. The Brand Admins can view all the tickets related to their brand, but they cannot assign tickets directly to the Agents.

Overall, this project aims to provide a robust and scalable solution for managing customer support tickets for multiple brands in a single platform. The multitenant architecture ensures that each brand has its dedicated space while still sharing the same system infrastructure, resulting in cost-effective and efficient support management.

# Tech Stack

1) Backend - NodeJS, ExpressJs 
2) Database - MongoDB
3) Fronted - AngularJS
4) Services - AWS S3, AWS SQS

# Agent View

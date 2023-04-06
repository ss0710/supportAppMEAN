# supportApp
![alt text](https://user-images.githubusercontent.com/63851816/230056946-410f6c08-8148-4a2c-b039-d433efdf0d1f.png)

# Overview
The project is a support app that provides a platform for brands to manage customer support tickets efficiently.

1) The app is built on a multitenant architecture, which includes a hierarchy of users consisting of Superadmin, Brands, Brand Admin, Managers, and Agents. The Superadmin has the highest level of access and control over the entire system, while the Brands have their dedicated space to manage their support tickets.

2) The Managers are responsible for assigning and managing support tickets to Agents. They can view the status of the tickets and update them as necessary. The Managers have access to all the tickets assigned to their team members, and they can escalate them to higher-level support if needed.

3) The Brand Admins are responsible for creating Managers and Agents for their brand. They can also manage their brand's support settings, such as SLA policies, support channels, and automation rules. The Brand Admins can view all the tickets related to their brand, but they cannot assign tickets directly to the Agents.

Overall, this project aims to provide a robust and scalable solution for managing customer support tickets for multiple brands in a single platform. The multitenant architecture ensures that each brand has its dedicated space while still sharing the same system infrastructure, resulting in cost-effective and efficient support management.

# Multitenant Architecture
![alt text](https://user-images.githubusercontent.com/63851816/230068579-7de35088-f32d-4548-8825-1318196c8e16.png)

# Tech Stack

1) Backend - NodeJS, ExpressJs 
2) Database - MongoDB
3) Fronted - AngularJS
4) Services - AWS S3, AWS SQS, SocketJS

# Agent View
Agent can view assigned tickets and may accept or reject the tikcets. Agents get notification for each updates on tickets assigned to him.

![alt text](https://user-images.githubusercontent.com/63851816/230070039-ebfd4372-ff20-40ca-b304-294c6df41a75.png)

Agent has access to ticket dashboard. Tickets dashboard includes status change option, attachments, ticket history and ticket comments.

![alt text](https://user-images.githubusercontent.com/63851816/230070282-b3209140-4abe-4c0c-a55b-d897662365d2.png)

# Manager View
Managers and agents gets notification for each ticket updates

![alt text](https://user-images.githubusercontent.com/63851816/230072644-0770e2e0-2afd-45df-8c79-3cb5a936f1d1.png)

Manager can view, update, add, disable and delete Agents Profile.

![alt text](https://user-images.githubusercontent.com/63851816/230072878-f8619e03-a21e-4cfe-9c92-b425323fc03e.png)

Manager can view ticket status assigned to agents. If tickets are rejected by agent then he can reassign the tikets to some other agent.Server side pagination has been done on each list to optimize data loading time.

![alt text](https://user-images.githubusercontent.com/63851816/230074450-36d67cd1-add3-4ab2-8653-a4e64f9c1912.png)

# Brand Admin View

Brand admin has the authority to view, update, delete, disable all the managers and agents of the brands. Brand Admin can view all the tickets status through dynamic filter options.

![alt text](https://user-images.githubusercontent.com/63851816/230080131-a6a87cab-243e-4c4e-b1ed-fac98bffbdc1.png)

Brand Admin can view the important data analytics and stats of Brand and Tickets like efficiency of each employee, average ticket solving time, Top perfoming employees.

![alt text](https://user-images.githubusercontent.com/63851816/230080627-10811d29-b8aa-481d-95de-92f098cb4bfa.png)

![alt text](https://user-images.githubusercontent.com/63851816/230080701-48b9f938-5ca2-4c55-b3b3-ced7b46ffee1.png)

Brand Admin can view profile of each employee and their activity/contribution heat map.

![alt text](https://user-images.githubusercontent.com/63851816/230081007-59a12bfb-9cc1-42a4-acfd-fa7de68ba5ec.png)

# Superadmin View

SuperAdmin adds brands and brand admins. Brand admins receive their login credentials as soon as their brands are registered.

![alt text](https://user-images.githubusercontent.com/63851816/230286296-b09034aa-a6e5-4abd-bfe4-96823a52d431.png)

The Superadmin has access to the statistical insights of all the registered brands. The Superadmin can view in-depth statistics of each individual brand and monitor their progress.

![alt text](https://user-images.githubusercontent.com/63851816/230286711-3b4634f9-e716-4ad5-ae42-236002219953.png)
![alt text](https://user-images.githubusercontent.com/63851816/230286783-d21cac27-96e1-4400-91c7-1908dc3f13ff.png)
![alt text](https://user-images.githubusercontent.com/63851816/230286850-9290870c-e4c4-4f4a-b87b-488601d11c0d.png)

update role set name = 'ANALYST', description = 'lab analyst' where name = 'USER';

create table role_bu as select * from role;
create table employee_role_bu as select * from employee_role;

drop table employee_role;
drop table role;

create table role
(
    name        varchar(20) not null
        constraint role_pkey
            primary key,
    description varchar(200)
);

create table employee_role
(
    emp_id  int not null
        constraint fk_emprole_emp
            references employee,
    role_name varchar(20) not null
        constraint fk_emprole_role
            references role,
    constraint employee_role_pkey
        primary key (emp_id, role_name)
);


create index ix_emprole_rolename
    on employee_role (role_name);


insert into role(name, description) select name, description from role_bu;

insert into employee_role(emp_id, role_name)
  select erbu.emp_id, (select rbu.name from role_bu rbu where rbu.id = erbu.role_id) from employee_role_bu erbu;

drop table role_bu;
drop table employee_role_bu;


alter table lab_group_test_type drop column id;
drop index ix_lgrptstt_lgrpid;
alter table lab_group_test_type drop constraint un_lgrptstt_tsttidlgrpid;
alter table lab_group_test_type add constraint pk_lgrptstt_pk primary key (lab_group_id, test_type_id);
create index ix_lgrptstt_tsttid
    on lab_group_test_type (test_type_id);



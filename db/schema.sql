/*
select 'drop table ' || table_name || ' cascade constraints purge;' drop_command
from user_tables
;

purge recyclebin;
*/

create table lab_group (
  name varchar(20) not null constraint pk_labgrp primary key,
  address_street varchar(200),
  address_buildings_and_rooms varchar(200),
  address_city varchar(200),
  address_state varchar(2),
  address_zip varchar(11),
  description varchar(100)
);

create table employee (
  facts_id int constraint pk_emp primary key,
  username varchar(20) not null,
  lab_group_name varchar(20) not null
    constraint fk_emp_labgrp references lab_group,
  password varchar(60),
  email varchar(150) not null,
  last_name varchar(60) not null,
  first_name varchar(60) not null,
  middle_name_or_initial varchar(60),

  constraint un_emp_shortnmlabgrp unique (username, lab_group_name)
);
create index ix_emp_labgrp on employee(lab_group_name);


create table sample_pac (
  sample_num int,
  pac_code varchar(20),
  product_name varchar(50) not null,
  received date,
  received_by varchar(100),
--   is_imported char(1) not null constraint ck_sampk_isimported_yn check(is_imported in ('Y','N')),
  constraint pk_sampk primary key (sample_num, pac_code)
);

create table sample_pac_assignment (
  sample_num int,
  pac_code varchar(20),
  employee_id int
    constraint fk_sampkass_emp references employee,
  constraint pk_sampkass primary key(sample_num, pac_code, employee_id),
  constraint fk_sampkass_sampk foreign key (sample_num, pac_code) references sample_pac
);
create index ix_sampkass_employeeid on sample_pac_assignment (employee_id);

create table lab_resource (
  id varchar(20) constraint pk_labrsc primary key,
  type_name varchar(20) not null, -- controlled by enum
  lab_group_name varchar(20) not null
    constraint fk_labrsc_labgrp references lab_group,
  description varchar(200)
);
create index ix_labrsc_labgrpnm on lab_resource(lab_group_name);


create table test_type (
  name varchar(20) constraint pk_testtyp primary key,
  description varchar(200)
);

create table labgroup_testtype (
  lab_group_name varchar(20) not null
    constraint fk_labgrptesttyp_labgrp references lab_group,
  test_type_name varchar(20) not null
    constraint fk_labgrptesttyp_testtyp references test_type,

  constraint pk_labgrptesttyp primary key (lab_group_name, test_type_name)
);

create table sampling_method (
  name varchar(50) constraint pk_sampmeth primary key,
  description varchar(200),
  extracted_grams_per_sub int not null,
  num_subs int not null,
  num_comps int not null,
  comp_grams int,
  num_subs_per_comp int not null
);

create table labgrp_testtype_samplingmethod (
  lab_group_name varchar(20) not null
    constraint fk_labgrptesttsmpmeth_labgrp references lab_group,
  test_type_name varchar(20) not null
    constraint fk_labgrptesttsmpmeth_testtyp references test_type,
  sampling_method_name varchar(50) not null
    constraint fk_labgrptesttsmpmeth_smpmeth references sampling_method,
  priority int,

  constraint pk_labgrptesttsmpmeth primary key (lab_group_name, test_type_name, sampling_method_name)
);

create table lab_test (
  id int constraint pk_labtest primary key,
  sample_num int,
  pac_code varchar(20),
  lab_group_name varchar(20) not null,
  test_type_name varchar(20) not null,
  begin_date date not null,
  data blob not null,
  note varchar(100),
  saved timestamp with time zone not null,
  saved_by_employee_id int
    constraint fk_labtest_emp_savedby references employee,
  reviewed timestamp with time zone not null,
  reviewed_by_employee_id int
    constraint fk_labtest_employee references employee,

  constraint fk_labtest_sampk
    foreign key (sample_num, pac_code) references sample_pac,
  constraint fk_labtest_labgrptesttyp
    foreign key (lab_group_name, test_type_name) references labgroup_testtype,
  constraint ck_labtest_savediffsavedby
    check ( nvl2(saved,1,0) = nvl2(saved_by_employee_id,1,0) ),
  constraint ck_labtest_revsgndiffdated
    check ( nvl2(reviewed,1,0) = nvl2(reviewed_by_employee_id,1,0) )
);
create index ix_labtest_smppac on lab_test(sample_num, pac_code);
create index ix_labtest_employee on lab_test(reviewed_by_employee_id);
create index ix_labtest_labgrptesttyp on lab_test(lab_group_name, test_type_name);


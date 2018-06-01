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
  id int generated always as identity constraint pk_emp primary key,
  facts_id int,
  short_name varchar(20) not null,
  lab_group_name varchar(20) not null
    constraint fk_emp_labgrp references lab_group,
  email varchar(150) not null,
  last_name varchar(60) not null,
  first_name varchar(60) not null,
  middle_name_or_initial varchar(60),

  constraint un_emp_shortnmlabgrp unique (short_name, lab_group_name)
);
create index ix_emp_labgrp on employee(lab_group_name);
create index ix_emp_factsid on employee(facts_id);


create table sample_pac (
  sample_num int,
  pac_code varchar(20),
  product_name varchar(50) not null,
  received date,
  received_by varchar(100),
  is_imported char(1) not null constraint ck_sampk_isimported_yn check(is_imported in ('Y','N')),
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

create table resource_type (
  name varchar(20) constraint pk_rsctyp primary key
);

create table lab_resource (
  id varchar(20) constraint pk_labrsc primary key,
  type_name varchar(20) not null
    constraint fk_labrsc_rsctyp references resource_type,
  lab_group_name varchar(20) not null
    constraint fk_labrsc_labgrp references lab_group,
  description varchar(200)
);
create index ix_labrsc_typename on lab_resource(type_name);
create index ix_labrsc_labgrpnm on lab_resource(lab_group_name);


create table resource_maintenance_type (
  name varchar(20) constraint pk_rscmainttyp primary key
);

create table resource_maintenance (
  resource_id varchar(20)
    constraint fk_rscmaint_labrsc references lab_resource,
  maintenance_type_name varchar(20)
    constraint fk_rscmaint_rscmainttyp references resource_maintenance_type,
  maintenance_performed timestamp with time zone not null,
  vouching_employee_id int not null
    constraint fk_rscmaint_emp references employee,
  maintenance_note varchar(4000)
);


create table test_type (
  name varchar(20) constraint pk_testtyp primary key,
  description varchar(200),
  form_name varchar(200)
);

create table testtype_form_name (
  test_type_name varchar(20)
    constraint fk_testtypformnm_testtype references test_type,
  form_name varchar(30) not null,
  constraint pk_testtypformnm primary key(test_type_name, form_name)
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

create table test (
  id int constraint pk_test primary key,
  sample_num int,
  pac_code varchar(20),
  lab_group_name varchar(20) not null,
  test_type_name varchar(20) not null,
  begin_date date not null,
  data blob not null
    constraint ck_test_testdata_isjson check (data is json format json strict),
  note varchar(100),
  saved timestamp with time zone not null,
  saved_by_employee_id int
    constraint fk_test_emp_savedby references employee,
  reviewed timestamp with time zone not null,
  reviewed_by_employee_id int
    constraint fk_test_employee references employee,

  constraint fk_test_sampk
    foreign key (sample_num, pac_code) references sample_pac,
  constraint fk_test_labgrptesttyp
    foreign key (lab_group_name, test_type_name) references labgroup_testtype,
  constraint ck_test_savediffsavedby
    check ( nvl2(saved,1,0) = nvl2(saved_by_employee_id,1,0) ),
  constraint ck_test_revsgndiffdated
    check ( nvl2(reviewed,1,0) = nvl2(reviewed_by_employee_id,1,0) )
);
create index ix_test_smppac on test(sample_num, pac_code);
create index ix_test_employee on test(reviewed_by_employee_id);
create index ix_test_labgrptesttyp on test(lab_group_name, test_type_name);


create table AUDIT_ENTRY
(
  ID                           NUMBER(19) generated as identity
    primary key,
  ACTING_EMP_ID                NUMBER(19)         not null,
  ACTING_USERNAME              VARCHAR2(150 char) not null,
  ACTION                       VARCHAR2(50 char)  not null,
  LAB_GROUP_ID                 NUMBER(19)         not null,
  OBJECT_CONTEXT_METADATA_JSON CLOB,
  OBJECT_FROM_VALUE_JSON       CLOB,
  OBJECT_TO_VALUE_JSON         CLOB,
  OBJECT_TYPE                  VARCHAR2(50 char)  not null,
  TEST_ID                      NUMBER(19),
  TIMESTAMP                    TIMESTAMP(6)       not null,
  constraint ck_audent_objmd_isjson check (object_context_metadata_json is json format json strict),
  constraint ck_audent_objfromval_isjson check (object_from_value_json is json format json strict),
  constraint ck_audent_objtoval_isjson check (object_to_value_json is json format json strict)
)
;
create index IX_AUDENT_TIMESTAMP
  on AUDIT_ENTRY (TIMESTAMP)
;
create index IX_AUDENT_TESTID
  on AUDIT_ENTRY (TEST_ID)
;
create index IX_AUDENT_LABGRPID
  on AUDIT_ENTRY (LAB_GROUP_ID)
;
create index IX_AUDENT_EMPID
  on AUDIT_ENTRY (ACTING_EMP_ID)
;
create index IX_AUDENT_OBJT
  on AUDIT_ENTRY (OBJECT_TYPE)
;

create table LAB_GROUP
(
  ID                    NUMBER(19) generated as identity
    primary key,
  ADDRESS_CITY          VARCHAR2(200 char),
  ADDRESS_STATE         VARCHAR2(2 char),
  ADDRESS_STREET        VARCHAR2(200 char),
  ADDRESS_ZIP           VARCHAR2(11 char),
  BUILDINGS_AND_ROOMS   VARCHAR2(200 char),
  DESCRIPTION           VARCHAR2(100 char),
  FACTS_ORG_NAME        VARCHAR2(20 char) not null,
  NAME                  VARCHAR2(20 char) not null
    constraint UN_LABGRP_NAME
      unique
)
;

create table EMPLOYEE
(
  ID                     NUMBER(19) generated as identity
    primary key,
  FACTS_PERSON_ID        NUMBER(19)         not null
    constraint UN_EMP_FACTSPERSONID
      unique,
  FDA_EMAIL_ACCOUNT_NAME VARCHAR2(150 char) not null
    constraint UN_EMP_FDAEMAILACCN
      unique,
  FIRST_NAME             VARCHAR2(60 char)  not null,
  LAB_GROUP_ID           NUMBER(19)         not null
    constraint FK_EMP_LABGROUP
      references LAB_GROUP,
  LAST_NAME              VARCHAR2(60 char)  not null,
  MIDDLE_NAME            VARCHAR2(60 char),
  PASSWORD               VARCHAR2(200 char),
  SHORT_NAME             VARCHAR2(10 char)  not null,
  constraint UN_EMP_SHORTNAMELABGRP
    unique (SHORT_NAME, LAB_GROUP_ID)
)
;
create index IX_EMP_LABGROUPID
  on EMPLOYEE (LAB_GROUP_ID)
;

create table ROLE
(
  ID          NUMBER(19) generated as identity
    primary key,
  DESCRIPTION VARCHAR2(200 char),
  NAME        VARCHAR2(20 char) not null
    constraint UN_ROLE_NAME
      unique
)
;

create table EMPLOYEE_ROLE
(
  EMP_ID  NUMBER(19) not null
    constraint FK_EMPROLE_EMP
      references EMPLOYEE,
  ROLE_ID NUMBER(19) not null
    constraint FK_EMPROLE_ROLE
      references ROLE,
  primary key (EMP_ID, ROLE_ID)
)
;
create index IX_EMPROLE_EMPID
  on EMPLOYEE_ROLE (EMP_ID)
;
create index IX_EMPROLE_ROLEID
  on EMPLOYEE_ROLE (ROLE_ID)
;

create table TEST_TYPE
(
  ID          NUMBER(19) generated as identity
    primary key,
  CODE        VARCHAR2(50 char) not null
    constraint UN_TSTT_CODE
      unique,
  DESCRIPTION VARCHAR2(2000 char),
  NAME        VARCHAR2(80 char) not null
    constraint UN_TSTT_NAME
      unique,
  SHORT_NAME  VARCHAR2(80 char) not null
    constraint UN_TSTT_SHORTNAME
      unique
)
;

create table LAB_GROUP_TEST_TYPE
(
  ID                      NUMBER(19) generated as identity
    primary key,
  REPORT_NAMES_BAR_SEP    VARCHAR2(4000 char),
  TEST_CONFIGURATION_JSON CLOB,
  LAB_GROUP_ID            NUMBER(19) not null
    constraint FK_LGRPTSTT_LABGROUP
      references LAB_GROUP,
  TEST_TYPE_ID            NUMBER(19) not null
    constraint FK_LGRPTSTT_LABTESTTYPE
      references TEST_TYPE,
  constraint UN_LGRPTSTT_TSTTIDLGRPID
    unique (TEST_TYPE_ID, LAB_GROUP_ID),
  constraint ck_lgrptstt_tstoptsjson_isjson check (test_configuration_json is json format json strict)
)
;
create index IX_LGRPTSTT_LGRPID
  on LAB_GROUP_TEST_TYPE (LAB_GROUP_ID)
;


create table TEST
(
  ID                       NUMBER(19) generated as identity
    primary key,
  BEGIN_DATE               DATE,
  CREATED                  TIMESTAMP(6)       not null,
  CREATED_BY_EMP_ID        NUMBER(19)         not null
    constraint FK_TST_EMP_CREATED
      references EMPLOYEE,
  LAB_GROUP_ID             NUMBER(19)         not null
    constraint FK_TST_LABGRP
      references LAB_GROUP,
  LAST_SAVED               TIMESTAMP(6)       not null,
  LAST_SAVED_BY_EMP_ID     NUMBER(19)         not null
    constraint FK_TST_EMP_LASTSAVED
      references EMPLOYEE,
  LID                      VARCHAR2(20 char),
  NOTE                     VARCHAR2(200 char),
  OP_ID                    NUMBER(19)         not null,
  PAC                      VARCHAR2(20 char)  not null,
  PAF                      VARCHAR2(20 char),
  PRODUCT_NAME             VARCHAR2(500 char) not null,
  REVIEWED                 TIMESTAMP(6),
  REVIEWED_BY_EMP_ID       NUMBER(19)
    constraint FK_TST_EMP_REVIEWED
      references EMPLOYEE,
  SAMPLE_TRACKING_NUM      NUMBER(19)         not null,
  SAMPLE_TRACKING_SUB_NUM  NUMBER(19)         not null,
  SAVED_TO_FACTS           TIMESTAMP(6),
  SAVED_TO_FACTS_BY_EMP_ID NUMBER(19)
    constraint FK_TST_EMP_SAVEDTOFACTS
      references EMPLOYEE,
  STAGE_STATUSES_JSON      VARCHAR2(4000 char),
  SUBJECT                  VARCHAR2(500 char),
  TEST_DATA_JSON           CLOB,
  TEST_DATA_MD5            VARCHAR2(32 char)  not null,
  TEST_TYPE_ID             NUMBER(19)         not null
    constraint FK_TST_TSTT
      references TEST_TYPE,
  constraint ck_test_testdatajson_isjson check (test_data_json is json format json strict),
  constraint ck_test_stagestatusjson_isjson check (stage_statuses_json is json format json strict)
)
;
create index IX_TST_OPID
  on TEST (OP_ID)
;
create index IX_TST_TESTTYPEID
  on TEST (TEST_TYPE_ID)
;
create index IX_TST_LABGRPID
  on TEST (LAB_GROUP_ID)
;
create index IX_TST_CREATED
  on TEST (CREATED)
;
create index IX_TST_CREATEDEMPID
  on TEST (CREATED_BY_EMP_ID)
;
create index IX_TST_LASTSAVED
  on TEST (LAST_SAVED)
;
create index IX_TST_LASTSAVEDEMPID
  on TEST (LAST_SAVED_BY_EMP_ID)
;
create index IX_TST_BEGINDATE
  on TEST (BEGIN_DATE)
;
create index IX_TST_REVIEWEDEMPID
  on TEST (REVIEWED_BY_EMP_ID)
;
create index IX_TST_SAVEDTOFACTS
  on TEST (SAVED_TO_FACTS)
;
create index IX_TST_SAVEDTOFACTSEMPID
  on TEST (SAVED_TO_FACTS_BY_EMP_ID)
;
create index IX_TST_TESTDATAMD5
  on TEST (TEST_DATA_MD5)
;


create table TEST_TYPE_SEARCH_SCOPE
(
    test_type_id  int    not null
        constraint fk_testtsrchscope_testtype
            references test_type,
    scope_name   varchar(20) not null,
    scope_descr   varchar(100) not null,
    search_fields clob not null, -- array of TestSearchField dto
    constraint pk_testtsrchscope primary key (test_type_id, scope_name),
    constraint ck_testtsrchscope_sflds_isjson check (search_fields is json format json strict)
)
;


create table TEST_FILE
(
  ID             NUMBER(19) generated as identity
    primary key,
  DATA           BLOB               not null,
  LABEL          VARCHAR2(50 char),
  NAME           VARCHAR2(200 char) not null,
  ORDERING       NUMBER(19)         not null,
  TEST_DATA_PART VARCHAR2(4000 char),
  TEST_ID        NUMBER(19)         not null
    constraint FK_TSTFILE_TST
      references TEST,
  UPLOADED       TIMESTAMP(6)       not null
)
;
create index IX_TSTFILE_TSTID
  on TEST_FILE (TEST_ID)
;
create index IX_TSTFILE_TESTDATAPART
  on TEST_FILE (TEST_DATA_PART)
;

create table resource_group
(
  name varchar(50),
  description varchar(200),
  constraint pk_rscgrp primary key (name)
);

create table "resource"
(
  resource_group varchar(50) constraint fk_rscgrp references resource_group,
  code varchar(50),
  resource_type varchar(60) not null,
  description varchar(100),
  constraint pk_resource primary key (resource_group, code)
)
;
create view "RESOURCE" as select * from "resource";

create table lab_group_resource_group
(
  lab_group_id number(19) constraint fk_labgrprscgrp_labgrp references lab_group,
  resource_group varchar(50),
  constraint pk_labgrprscgrp primary key (lab_group_id, resource_group)
)
;

create index ix_tst_testdatajson on test(test_data_json) indextype is ctxsys.context parameters('sync (on commit)');

create or replace view test_v as
select
    t.id test_id,
    t.op_id,
    t.sample_tracking_num,
    t.sample_tracking_sub_num,
    t.pac,
    t.product_name,
    tt.code type_code,
    tt.name type_name,
    tt.short_name type_short_name,
    t.created created,
    ce.short_name created_by_emp,
    t.last_saved last_saved,
    se.short_name last_saved_by_emp,
    (select count(*) from test_file tf where tf.test_id = t.id) attached_files_count,
    TO_CHAR(t.begin_date, 'YYYY-MM-DD') begin_date,
    t.note,
    t.stage_statuses_json,
    t.reviewed,
    re.short_name reviewed_by_emp,
    t.saved_to_facts,
    fe.short_name saved_to_facts_by_emp,
    t.lid,
    t.paf,
    t.subject,
    t.test_data_json
from test t
join test_type tt on t.test_type_id = tt.id
join employee ce on ce.id = t.created_by_emp_id
join employee se on se.id = t.last_saved_by_emp_id
left join employee re on re.id = t.reviewed_by_emp_id
left join employee fe on fe.id = t.last_saved_by_emp_id
;

-- TODO: Create and try these views (needs 12.2).

create view employee_v as
select
   e.id employee_id,
   e.lab_group_id,
   lg.name lab_group_name,
   lg.facts_org_name lab_group_facts_org_name,
   e.facts_person_id,
   e.fda_email_account_name,
   e.short_name,
   e.first_name,
   e.last_name,
   e.middle_name,
   (select json_arrayagg(r.name) from role r
    where exists(select 1 from employee_role er where er.emp_id = e.id)) roles
from employee e
join lab_group lg on e.lab_group_id = lg.id
;

create view employee_reference_v as
select
    e.id employee_id,
    e.lab_group_id,
    e.facts_person_id,
    e.fda_email_account_name,
    e.short_name
from employee e
;

create view employee_reference_jv as
select
   employee_id,
   lab_group_id,
   json_object(
      key 'employee_id' value employee_id,
      key 'facts_person_id' value facts_person_id,
      key 'fda_email_account_name' value fda_email_account_name,
      key 'short_name' value short_name
   ) json
from employee_reference_v
;

create view lab_group_test_type_v as
select
   lgtt.lab_group_id,
   lgtt.test_configuration_json,
   lgtt.report_names_bar_sep,
   tt.id test_type_id,
   tt.code test_type_code,
   tt.name test_type_name,
   tt.short_name test_type_short_name,
   tt.description test_type_description
from lab_group_test_type lgtt
join test_type tt on lgtt.test_type_id = tt.id
;

create view lab_group_test_type_jv as
select
   lab_group_id,
   test_type_id,
   json_object(
      -- TODO: Make sure test_configuration_json isn't treated as an atomic json string value.
      key 'test_configuration_json' value test_configuration_json,
      key 'report_names_bar_sep'    value report_names_bar_sep,
      key 'test_type_id'            value test_type_id,
      key 'test_type_code'          value test_type_code,
      key 'test_type_name'          value test_type_name,
      key 'test_type_short_name'    value test_type_short_name,
      key 'test_type_description'   value test_type_description
   ) json
from lab_group_test_type_v
;

create view lab_group_resource_v as
select distinct
   lgrg.lab_group_id,
   r.resource_type,
   r.code,
   r.description,
   r.resource_group
from lab_group_resource_group lgrg
join "resource" r on r.resource_group = lgrg.resource_group
;

create view lab_group_resource_jv as
select
   lab_group_id,
   json_object(
     key 'resource_type' value resource_type,
     key 'code' value code,
     key 'description' value description,
     key 'resource_group' value resource_group
   ) as json
from lab_group_resource_v
;

create view employee_lab_group_context_v as
select
   e.employee_id,
   e.lab_group_id,
   e.lab_group_name,
   e.facts_person_id,
   e.fda_email_account_name,
   e.short_name,
   e.first_name,
   e.last_name,
   e.middle_name,
   e.lab_group_facts_org_name,
   e.roles employee_roles,
   (select json_arrayagg(lgtt.json)
    from lab_group_test_type_jv lgtt
    where lgtt.lab_group_id = e.lab_group_id) lab_group_test_types,
   (select json_arrayagg(ur.json)
    from employee_reference_jv ur
    where ur.lab_group_id = e.lab_group_id) lab_group_employees,
   (select json_arrayagg(lgr.json)
    from lab_group_resource_jv lgr
    where lgr.lab_group_id = e.lab_group_id) lab_group_resources
from employee_v e
;


create function make_json(json_str clob) return clob deterministic is
begin
   return json_str;
end;

create function blob_size(blob_data blob) return number is
begin
   return length(blob_data);
end;


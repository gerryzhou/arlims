/*
select 'drop table ' || table_name || ' cascade constraints purge;' drop_command
from user_tables
;

purge recyclebin;
*/

create table LAB_GROUP
(
  ID                  NUMBER(19) generated as identity
    primary key,
  ADDRESS_CITY        VARCHAR2(200 char),
  ADDRESS_STATE       VARCHAR2(2 char),
  ADDRESS_STREET      VARCHAR2(200 char),
  ADDRESS_ZIP         VARCHAR2(11 char),
  BUILDINGS_AND_ROOMS VARCHAR2(200 char),
  DESCRIPTION         VARCHAR2(100 char),
  NAME                VARCHAR2(20 char) not null
    constraint UN_LABGRP_NAME
    unique
)
/

create table EMPLOYEE
(
  ID              NUMBER(19) generated as identity
    primary key,
  EMAIL           VARCHAR2(150 char) not null,
  FACTS_PERSON_ID NUMBER(19),
  FIRST_NAME      VARCHAR2(60 char)  not null,
  LAST_NAME       VARCHAR2(60 char)  not null,
  MIDDLE_NAME     VARCHAR2(60 char),
  PASSWORD        VARCHAR2(200 char),
  SHORT_NAME      VARCHAR2(10 char)  not null,
  USERNAME        VARCHAR2(30 char)  not null
    constraint UN_EMP_USERNAME
    unique,
  LAB_GROUP_ID    NUMBER(19)         not null
    constraint FK_EMP_LABGROUP
    references LAB_GROUP,
  constraint UN_EMP_SHORTNAMELABGRP
  unique (SHORT_NAME, LAB_GROUP_ID)
)
/

create index IX_EMP_LABGROUPID
  on EMPLOYEE (LAB_GROUP_ID)
/

create index IX_EMP_FACTSPERSONID
  on EMPLOYEE (FACTS_PERSON_ID)
/

create table LAB_RESOURCE
(
  CODE          VARCHAR2(50 char) not null
    primary key,
  DESCRIPTION   VARCHAR2(100 char),
  RESOURCE_TYPE VARCHAR2(60 char) not null,
  LAB_GROUP_ID  NUMBER(19)        not null
    constraint FK_LABRSC_LABGROUP
    references LAB_GROUP
)
/

create index IX_LABRSC_LABGRPID
  on LAB_RESOURCE (LAB_GROUP_ID)
/

create table LAB_TEST_TYPE
(
  ID          NUMBER(19) generated as identity
    primary key,
  CODE        VARCHAR2(50 char) not null
    constraint UN_LABTSTT_CODE
    unique,
  DESCRIPTION VARCHAR2(200 char)
)
/

create table LAB_GROUP_LAB_TEST_TYPE
(
  LAB_GROUP_ID     NUMBER(19) not null
    constraint FK_LGRPLTSTT_LABGRP
    references LAB_GROUP,
  LAB_TEST_TYPE_ID NUMBER(19) not null
    constraint FK_LGRPLTSTT_LABTSTT
    references LAB_TEST_TYPE
)
/

create index IX_LGRPLTSTT_LABGRPID
  on LAB_GROUP_LAB_TEST_TYPE (LAB_GROUP_ID)
/

create index IX_LGRPLTSTT_LABTSTTID
  on LAB_GROUP_LAB_TEST_TYPE (LAB_TEST_TYPE_ID)
/

create table ROLE
(
  ID          NUMBER(19) generated as identity
    primary key,
  DESCRIPTION VARCHAR2(200 char),
  NAME        VARCHAR2(20 char) not null
    constraint UN_ROLE_NAME
    unique
)
/

create table EMPLOYEE_ROLE
(
  EMPLOYEE_ID NUMBER(19) not null
    constraint FK_EMPROLE_EMP
    references EMPLOYEE,
  ROLE_ID     NUMBER(19) not null
    constraint FK_EMPROLE_ROLE
    references ROLE,
  primary key (EMPLOYEE_ID, ROLE_ID)
)
/

create index IX_EMPROLE_EMPID
  on EMPLOYEE_ROLE (EMPLOYEE_ID)
/

create index IX_EMPROLE_ROLEID
  on EMPLOYEE_ROLE (ROLE_ID)
/

create table SAMPLE_UNIT
(
  ID           NUMBER(19) generated as identity
    primary key,
  PAC_CODE     VARCHAR2(20 char) not null,
  PRODUCT_NAME VARCHAR2(100 char),
  RECEIVED     DATE,
  RECEIVED_BY  VARCHAR2(100 char),
  SAMPLE_NUM   NUMBER(19)        not null,
  constraint UN_SMPUNIT_SMPNUMPACCD
  unique (SAMPLE_NUM, PAC_CODE)
)
/

create table LAB_TEST
(
  ID                      NUMBER(19) generated as identity
    primary key,
  BEGIN_DATE              DATE,
  NOTE                    VARCHAR2(200 char),
  REVIEWED                TIMESTAMP(6),
  REVIEWED_BY_EMPLOYEE_ID NUMBER(19)
    constraint FK_LABTST_EMP_REVBY
    references EMPLOYEE,
  SAVED                   TIMESTAMP(6) not null,
  SAVED_BY_EMPLOYEE_ID    NUMBER(19)   not null
    constraint FK_LABTST_EMP_SAVEDBY
    references EMPLOYEE,
  TEST_DATA_JSON          CLOB,
  LAB_GROUP_ID            NUMBER(19)   not null
    constraint FK_LABTST_LABGROUP
    references LAB_GROUP,
  SAMPLE_UNIT_ID          NUMBER(19)   not null
    constraint FK_LABTST_SAMPLEUNIT
    references SAMPLE_UNIT,
  TEST_TYPE_ID            NUMBER(19)   not null
    constraint FK_LABTST_LABTESTTYPE
    references LAB_TEST_TYPE
)
/

create index IX_LABTST_SMPUNTID
  on LAB_TEST (SAMPLE_UNIT_ID)
/

create index IX_LABTST_LABGRPID
  on LAB_TEST (LAB_GROUP_ID)
/

create index IX_LABTST_TESTTYPEID
  on LAB_TEST (TEST_TYPE_ID)
/

create index IX_LABTST_SAVEDBYEMPID
  on LAB_TEST (SAVED_BY_EMPLOYEE_ID)
/

create index IX_LABTST_REVIEWEDBYEMPID
  on LAB_TEST (REVIEWED_BY_EMPLOYEE_ID)
/

create table SAMPLE_UNIT_ASSIGNMENT
(
  EMPLOYEE_ID    NUMBER(19) not null
    constraint FK_SMPUNTAST_EMP
    references EMPLOYEE,
  SAMPLE_UNIT_ID NUMBER(19) not null
    constraint FK_SMPUNTAST_SMPUNT
    references SAMPLE_UNIT
)
/

create index IX_SMPUNTAST_EMPID
  on SAMPLE_UNIT_ASSIGNMENT (EMPLOYEE_ID)
/

create index IX_SMPUNTAST_SMPUNTID
  on SAMPLE_UNIT_ASSIGNMENT (SAMPLE_UNIT_ID)
/

create table SAMPLING_METHOD
(
  ID            NUMBER(19) generated as identity
    primary key,
  COMP_GRAMS    NUMBER(10)        not null,
  DESCRIPTION   VARCHAR2(200 char),
  NAME          VARCHAR2(50 char) not null
    constraint UN_SMPMTH_NAME
    unique,
  NUM_COMPS     NUMBER(10)        not null,
  NUM_SUBS      NUMBER(10)        not null,
  SUB_GRAMS     NUMBER(10)        not null,
  SUBS_PER_COMP NUMBER(10)        not null
)
/

create table LAB_TEST_TYPE_SAMPLING_METHOD
(
  LAB_TEST_TYPE_ID   NUMBER(19) not null
    constraint FK_LTSTTSMPMTH_LABTSTT
    references LAB_TEST_TYPE,
  SAMPLING_METHOD_ID NUMBER(19) not null
    constraint FK_LTSTTSMPMTH_SMPMTH
    references SAMPLING_METHOD
)
/

create index IX_LTSTTSMPMTH_LABTSTTID
  on LAB_TEST_TYPE_SAMPLING_METHOD (LAB_TEST_TYPE_ID)
/

create index IX_LTSTTSMPMTH_SMPMTHID
  on LAB_TEST_TYPE_SAMPLING_METHOD (SAMPLING_METHOD_ID)
/



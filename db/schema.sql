/*
select 'drop table ' || table_name || ' cascade constraints purge;' drop_command
from user_tables
;

purge recyclebin;
*/

create table LAB_GROUP
(
  NAME                        VARCHAR2(20 char) not null
    primary key,
  ADDRESS_BUILDINGS_AND_ROOMS VARCHAR2(200 char),
  ADDRESS_CITY                VARCHAR2(200 char),
  ADDRESS_STATE               VARCHAR2(2 char),
  ADDRESS_STREET              VARCHAR2(200 char),
  ADDRESS_ZIP                 VARCHAR2(11 char),
  DESCRIPTION                 VARCHAR2(100 char)
)
/

create table EMPLOYEE
(
  ID                     NUMBER(19) generated as identity
    primary key,
  EMAIL                  VARCHAR2(150 char) not null,
  FACTS_PERSON_ID        NUMBER(19),
  FIRST_NAME             VARCHAR2(60 char)  not null,
  LAB_GROUP_NAME         VARCHAR2(255 char) not null
    constraint FK_EMP_LABGROUP
    references LAB_GROUP,
  LAST_NAME              VARCHAR2(60 char)  not null,
  MIDDLE_NAME_OR_INITIAL VARCHAR2(60 char),
  PASSWORD               VARCHAR2(200 char),
  SHORT_NAME             VARCHAR2(10 char)  not null,
  USERNAME               VARCHAR2(30 char)  not null
    constraint UN_EMP_USERNAME
    unique,
  constraint UN_EMP_SHORTNAMELABGRP
  unique (SHORT_NAME, LAB_GROUP_NAME)
)
/

create index IX_EMP_LABGROUPNAME
  on EMPLOYEE (LAB_GROUP_NAME)
/

create table LAB_RESOURCE
(
  CODE           VARCHAR2(20 char)  not null
    primary key,
  DESCRIPTION    VARCHAR2(255 char),
  LAB_GROUP_NAME VARCHAR2(255 char) not null
    constraint FK_LABRSC_LABGROUP
    references LAB_GROUP,
  RESOURCE_TYPE  VARCHAR2(60 char)  not null
)
/

create table LAB_TEST_TYPE
(
  NAME        VARCHAR2(20 char) not null
    primary key,
  DESCRIPTION VARCHAR2(200 char)
)
/

create table LAB_GROUP_LAB_TEST_TYPE
(
  LAB_GROUP_NAME     VARCHAR2(20 char) not null
    constraint FK_LGRPLTSTT_LGRP
    references LAB_GROUP,
  LAB_TEST_TYPE_NAME VARCHAR2(20 char) not null
    constraint FK_LGRPLTSTT_LTSTT
    references LAB_TEST_TYPE
)
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
  constraint UN_SMPUNIT_SMPNUMPAC
  unique (SAMPLE_NUM, PAC_CODE)
)
/

create table LAB_TEST
(
  ID                      NUMBER(19) generated as identity
    primary key,
  BEGIN_DATE              DATE,
  LAB_GROUP_NAME          VARCHAR2(255 char) not null
    constraint FK_LABTST_LABGROUP
    references LAB_GROUP,
  NOTE                    VARCHAR2(200 char),
  REVIEWED                TIMESTAMP(6),
  REVIEWED_BY_EMPLOYEE_ID NUMBER(19)
    constraint FK_LABTST_EMP_REVBY
    references EMPLOYEE,
  SAVED                   TIMESTAMP(6)       not null,
  SAVED_BY_EMPLOYEE_ID    NUMBER(19)         not null
    constraint FK_LABTST_EMP_SAVEDBY
    references EMPLOYEE,
  TEST_DATA_JSON          CLOB,
  TEST_TYPE_NAME          VARCHAR2(255 char) not null
    constraint FK_LABTST_LABTESTTYPE
    references LAB_TEST_TYPE,
  SAMPLE_UNIT_ID          NUMBER(19)         not null
    constraint FK_LABTST_SAMPLEUNIT
    references SAMPLE_UNIT
)
/

create index IX_LABTST_SAMPLEUNIT
  on LAB_TEST (SAMPLE_UNIT_ID)
/

create index IX_LABTST_LABGROUP
  on LAB_TEST (LAB_GROUP_NAME)
/

create index IX_LABTST_TESTTYPE
  on LAB_TEST (TEST_TYPE_NAME)
/

create index IX_LABTST_SAVEDBYEMP
  on LAB_TEST (SAVED_BY_EMPLOYEE_ID)
/

create index IX_LABTST_REVIEWEDBYEMP
  on LAB_TEST (REVIEWED_BY_EMPLOYEE_ID)
/

create table SAMPLE_UNIT_ASSIGNMENT
(
  EMPLOYEE_ID    NUMBER(19) not null
    constraint FK_SMPUNITAST_EMP
    references EMPLOYEE,
  SAMPLE_UNIT_ID NUMBER(19) not null
    constraint FK_SMPUNITAST_SAMPLEUNIT
    references SAMPLE_UNIT
)
/

create index IX_SMPGRPAST_EMPID
  on SAMPLE_UNIT_ASSIGNMENT (EMPLOYEE_ID)
/

create index IX_SMPGRPAST_SAMPUNITID
  on SAMPLE_UNIT_ASSIGNMENT (SAMPLE_UNIT_ID)
/

create table SAMPLING_METHOD
(
  NAME          VARCHAR2(50 char)  not null
    primary key,
  COMP_GRAMS    NUMBER(10)         not null,
  DESCRIPTION   VARCHAR2(200 char) not null,
  NUM_COMPS     NUMBER(10)         not null,
  NUM_SUBS      NUMBER(10)         not null,
  SUB_GRAMS     NUMBER(10)         not null,
  SUBS_PER_COMP NUMBER(10)         not null
)
/

create table LAB_TEST_TYPE_SAMPLING_METHOD
(
  LAB_TEST_TYPE_NAME   VARCHAR2(20 char) not null
    constraint FK_LTSTTSMPMTH_LBTSTT
    references LAB_TEST_TYPE,
  SAMPLING_METHOD_NAME VARCHAR2(50 char) not null
    constraint FK_LTSTTSMPMTH_SMPMTH
    references SAMPLING_METHOD
)
/

create index IX_LTSTTSMPMTH_LTSTTNM
  on LAB_TEST_TYPE_SAMPLING_METHOD (LAB_TEST_TYPE_NAME)
/

create index IX_LTSTTSMPMTH_SMPMTHNM
  on LAB_TEST_TYPE_SAMPLING_METHOD (SAMPLING_METHOD_NAME)
/

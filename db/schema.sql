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

create index IX_EMP_EMAIL
  on EMPLOYEE (EMAIL)
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

create table RECEIVED_SAMPLE
(
  ID              NUMBER(19) generated as identity
    primary key,
  ACTIVE          NUMBER(1)         not null,
  PAC_CODE        VARCHAR2(20 char) not null,
  PRODUCT_NAME    VARCHAR2(100 char),
  RECEIVED        DATE              not null,
  RECEIVED_BY     VARCHAR2(100 char),
  SAMPLE_NUM      NUMBER(19)        not null,
  TEST_BEGIN_DATE DATE,
  LAB_GROUP_ID    NUMBER(19)        not null
    constraint FK_RCVSMP_LABGROUP
    references LAB_GROUP
)
/

create index IX_RCVSMP_LABGRPID
  on RECEIVED_SAMPLE (LAB_GROUP_ID)
/

create index IX_RCVSMP_SMPNUMPACCD
  on RECEIVED_SAMPLE (SAMPLE_NUM, PAC_CODE)
/

create index IX_RCVSMP_RECEIVED
  on RECEIVED_SAMPLE (RECEIVED)
/

create index IX_RCVSMP_TESTBEGINDATE
  on RECEIVED_SAMPLE (TEST_BEGIN_DATE)
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
  EMP_ID  NUMBER(19) not null
    constraint FK_EMPROLE_EMP
    references EMPLOYEE,
  ROLE_ID NUMBER(19) not null
    constraint FK_EMPROLE_ROLE
    references ROLE,
  primary key (EMP_ID, ROLE_ID)
)
/

create index IX_EMPROLE_EMPID
  on EMPLOYEE_ROLE (EMP_ID)
/

create index IX_EMPROLE_ROLEID
  on EMPLOYEE_ROLE (ROLE_ID)
/

create table SAMPLE_EMPLOYEE_ASSIGNMENT
(
  SAMPLE_ID NUMBER(19) not null
    constraint FK_SMPEMPAST_RCVSMP
    references RECEIVED_SAMPLE,
  EMP_ID    NUMBER(19) not null
    constraint FK_SMPEMPAST_EMP
    references EMPLOYEE,
  primary key (SAMPLE_ID, EMP_ID)
)
/

create index IX_SMPEMPAST_SMPID
  on SAMPLE_EMPLOYEE_ASSIGNMENT (SAMPLE_ID)
/

create index IX_SMPEMPAST_EMPID
  on SAMPLE_EMPLOYEE_ASSIGNMENT (EMP_ID)
/

create table SAMPLE_LIST
(
  ID                NUMBER(19) generated as identity
    primary key,
  ACTIVE            NUMBER(1)    not null,
  CREATED           TIMESTAMP(6) not null,
  NAME              VARCHAR2(30 char),
  CREATED_BY_EMP_ID NUMBER(19)   not null
    constraint FK_SMPLST_EMP_CREATED
    references EMPLOYEE,
  LAB_GROUP_ID      NUMBER(19)   not null
    constraint FK_SMPLST_LABGRP
    references LAB_GROUP
)
/

create table SAMPLE_LIST_SAMPLE
(
  SAMPLE_LIST_ID NUMBER(19) not null
    constraint FK_SMPLSTSMP_SMPLST
    references SAMPLE_LIST,
  SAMPLE_ID      NUMBER(19) not null
    constraint FK_SMPLSTSMP_SMP
    references RECEIVED_SAMPLE,
  SAMPLES_ORDER  NUMBER(10) not null,
  primary key (SAMPLE_LIST_ID, SAMPLES_ORDER)
)
/

create index IX_SMPLSTSMP_SMPLSTID
  on SAMPLE_LIST_SAMPLE (SAMPLE_LIST_ID)
/

create index IX_SMPLSTSMP_SMPID
  on SAMPLE_LIST_SAMPLE (SAMPLE_ID)
/

create index IX_SMPLST_LABGROUPID
  on SAMPLE_LIST (LAB_GROUP_ID)
/

create index IX_SMPLST_CREATEDEMPID
  on SAMPLE_LIST (CREATED_BY_EMP_ID)
/

create index IX_SMPLST_CREATED
  on SAMPLE_LIST (CREATED)
/

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
    unique
)
/

create table LAB_GROUP_TEST_TYPE
(
  ID                NUMBER(19) generated as identity
    primary key,
  TEST_OPTIONS_JSON CLOB,
  LAB_GROUP_ID      NUMBER(19) not null
    constraint FK_LGRPTSTT_LABGROUP
    references LAB_GROUP,
  TEST_TYPE_ID      NUMBER(19) not null
    constraint FK_LGRPTSTT_LABTESTTYPE
    references TEST_TYPE,
  constraint UN_LGRPTSTT_TSTTIDLGRPID
  unique (TEST_TYPE_ID, LAB_GROUP_ID)
)
/

create index IX_LGRPTSTT_LGRPID
  on LAB_GROUP_TEST_TYPE (LAB_GROUP_ID)
/

create table TEST
(
  ID                   NUMBER(19) generated as identity
    primary key,
  BEGIN_DATE           DATE,
  CREATED              TIMESTAMP(6) not null,
  LAST_SAVED           TIMESTAMP(6) not null,
  NOTE                 VARCHAR2(200 char),
  REVIEWED             TIMESTAMP(6),
  SAVED_TO_FACTS       TIMESTAMP(6),
  TEST_DATA_JSON       CLOB,
  CREATED_BY_EMP_ID    NUMBER(19)   not null
    constraint FK_TST_EMP_CREATED
    references EMPLOYEE,
  LAB_GROUP_ID         NUMBER(19)   not null
    constraint FK_TST_LABGRP
    references LAB_GROUP,
  LAST_SAVED_BY_EMP_ID NUMBER(19)   not null
    constraint FK_TST_EMP_LASTSAVED
    references EMPLOYEE,
  REVIEWED_BY_EMP_ID   NUMBER(19)
    constraint FK_TST_EMP_REVIEWED
    references EMPLOYEE,
  SAMPLE_ID            NUMBER(19)   not null
    constraint FK_TST_RCVSMP
    references RECEIVED_SAMPLE,
  TEST_TYPE_ID         NUMBER(19)   not null
    constraint FK_TST_TSTT
    references TEST_TYPE
)
/

create index IX_TST_SMPID
  on TEST (SAMPLE_ID)
/

create index IX_TST_TESTTYPEID
  on TEST (TEST_TYPE_ID)
/

create index IX_TST_LABGRPID
  on TEST (LAB_GROUP_ID)
/

create index IX_TST_CREATED
  on TEST (CREATED)
/

create index IX_TST_CREATEDEMPID
  on TEST (CREATED_BY_EMP_ID)
/

create index IX_TST_LASTSAVED
  on TEST (LAST_SAVED)
/

create index IX_TST_LASTSAVEDEMPID
  on TEST (LAST_SAVED_BY_EMP_ID)
/

create index IX_TST_BEGINDATE
  on TEST (BEGIN_DATE)
/

create index IX_TST_REVIEWEDEMPID
  on TEST (REVIEWED_BY_EMP_ID)
/

create index IX_TST_SAVEDTOFACTS
  on TEST (SAVED_TO_FACTS)
/

create table TEST_MANAGED_RESOURCE
(
  ID            NUMBER(19) generated as identity
    primary key,
  RESOURCE_CODE VARCHAR2(255 char)
    constraint FK_TSTMANRSC_LABRSC
    references LAB_RESOURCE,
  TEST_ID       NUMBER(19)
    constraint FK_TSTMANRSC_TST
    references TEST,
  constraint UN_TSTMANRSC_TSTIDRSCCD
  unique (TEST_ID, RESOURCE_CODE)
)
/

create index IX_TSTMANRSC_TSTID
  on TEST_MANAGED_RESOURCE (TEST_ID)
/

create index IX_TSTMANRSC_RSCCD
  on TEST_MANAGED_RESOURCE (RESOURCE_CODE)
/

create table TEST_UNMANAGED_RESOURCE
(
  ID            NUMBER(19) generated as identity
    primary key,
  RESOURCE_CODE VARCHAR2(50 char) not null,
  RESOURCE_TYPE VARCHAR2(60 char),
  TEST_ID       NUMBER(19)
    constraint FK_TSTUNMRSC_TST
    references TEST,
  constraint UN_TSTUNMRSC_TSTIDRSCCDRSCT
  unique (TEST_ID, RESOURCE_CODE, RESOURCE_TYPE)
)
/

create index IX_TSTUNMRSC_TSTID
  on TEST_UNMANAGED_RESOURCE (TEST_ID)
/

create index IX_TSTUNMRSC_RSCCD
  on TEST_UNMANAGED_RESOURCE (RESOURCE_CODE)
/

create index IX_TSTUNMRSC_RSCT
  on TEST_UNMANAGED_RESOURCE (RESOURCE_TYPE)
/


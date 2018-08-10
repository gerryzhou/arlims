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
  ID                     NUMBER(19) generated as identity
    primary key,
  FACTS_PERSON_ID        NUMBER(19),
  FDA_EMAIL_ACCOUNT_NAME VARCHAR2(150 char) not null
    constraint UN_EMP_FDAEMAILACCN
    unique,
  FIRST_NAME             VARCHAR2(60 char)  not null,
  LAST_NAME              VARCHAR2(60 char)  not null,
  MIDDLE_NAME            VARCHAR2(60 char),
  PASSWORD               VARCHAR2(200 char),
  SHORT_NAME             VARCHAR2(10 char)  not null,
  LAB_GROUP_ID           NUMBER(19)         not null
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
  LAB_GROUP_ID  NUMBER(19)
    constraint FK_LABRSC_LABGROUP
    references LAB_GROUP,
  RESOURCE_TYPE VARCHAR2(60 char) not null
)
/

create index IX_LABRSC_LABGRPID
  on LAB_RESOURCE (LAB_GROUP_ID)
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

create table SAMPLE
(
  ID                        NUMBER(19) generated as identity
    primary key,
  FACTS_STATUS              VARCHAR2(30 char) not null,
  FACTS_STATUS_DATE         DATE              not null,
  LAB_GROUP_ID              NUMBER(19)
    constraint FK_SMP_LABGROUP
    references LAB_GROUP,
  LAST_REFRESHED_FROM_FACTS TIMESTAMP(6)      not null,
  LID                       VARCHAR2(20 char),
  PAC                       VARCHAR2(20 char) not null,
  PAF                       VARCHAR2(20 char),
  PRODUCT_NAME              VARCHAR2(100 char),
  RECEIVED                  DATE,
  RECEIVED_BY               VARCHAR2(100 char),
  SAMPLE_NUM                VARCHAR2(20 char) not null,
  SAMPLING_ORG              VARCHAR2(30 char),
  SUBJECT                   VARCHAR2(4000 char)
)
/

create index IX_SMP_LABGRPID
  on SAMPLE (LAB_GROUP_ID)
/

create index IX_SMP_SMPNUMPAC
  on SAMPLE (SAMPLE_NUM, PAC)
/

create index IX_SMP_RECEIVED
  on SAMPLE (RECEIVED)
/

create index IX_SMP_FACTSSTATUS
  on SAMPLE (FACTS_STATUS)
/

create table SAMPLE_ASSIGNMENT
(
  ID            NUMBER(19) generated as identity
    primary key,
  ASSIGNED_DATE DATE,
  EMPLOYEE_ID   NUMBER(19)
    constraint FK_SMPAST_EMP
    references EMPLOYEE,
  LEAD          NUMBER(1),
  SAMPLE_ID     NUMBER(19)
    constraint FK_SMPAST_SMP
    references SAMPLE,
  constraint UN_SMPAST_SMPIDEMPID
  unique (SAMPLE_ID, EMPLOYEE_ID)
)
/

create index IX_SMPAST_EMPID
  on SAMPLE_ASSIGNMENT (EMPLOYEE_ID)
/

create table SAMPLE_MANAGED_RESOURCE
(
  ID            NUMBER(19) generated as identity
    primary key,
  EMPLOYEE_ID   NUMBER(19)
    constraint FK_SMPMANRSC_EMP
    references EMPLOYEE,
  LIST_NAME     VARCHAR2(50 char) not null,
  RESOURCE_CODE VARCHAR2(255 char)
    constraint FK_SMPMANRSC_LABRSC
    references LAB_RESOURCE,
  SAMPLE_ID     NUMBER(19)
    constraint FK_SMPMANRSC_SMP
    references SAMPLE
)
/

create index IX_SMPMANRSC_SMPIDEMPIDLSTN
  on SAMPLE_MANAGED_RESOURCE (SAMPLE_ID, EMPLOYEE_ID, LIST_NAME)
/

create index IX_SMPMANRSC_RSCCD
  on SAMPLE_MANAGED_RESOURCE (RESOURCE_CODE)
/

create table SAMPLE_UNMANAGED_RESOURCE
(
  ID            NUMBER(19) generated as identity
    primary key,
  EMPLOYEE_ID   NUMBER(19)
    constraint FK_SMPUNMRSC_EMP
    references EMPLOYEE,
  LIST_NAME     VARCHAR2(50 char) not null,
  RESOURCE_CODE VARCHAR2(50 char) not null,
  RESOURCE_TYPE VARCHAR2(60 char),
  SAMPLE_ID     NUMBER(19)
    constraint FK_SMPUNMRSC_SMP
    references SAMPLE
)
/

create index IX_SMPUNMRSC_SMPIDEMPIDLSTN
  on SAMPLE_UNMANAGED_RESOURCE (SAMPLE_ID, EMPLOYEE_ID, LIST_NAME)
/

create index IX_SMPUNMRSC_RSCCD
  on SAMPLE_UNMANAGED_RESOURCE (RESOURCE_CODE)
/

create index IX_SMPUNMRSC_RSCT
  on SAMPLE_UNMANAGED_RESOURCE (RESOURCE_TYPE)
/

create table SAMPLE_LIST
(
  ID                NUMBER(19) generated as identity
    primary key,
  ACTIVE            NUMBER(1)         not null,
  CREATED           TIMESTAMP(6)      not null,
  NAME              VARCHAR2(30 char) not null
    constraint UN_SMPLST_NAME
    unique,
  CREATED_BY_EMP_ID NUMBER(19)        not null
    constraint FK_SMPLST_EMP_CREATED
    references EMPLOYEE,
  LAB_GROUP_ID      NUMBER(19)        not null
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
    references SAMPLE,
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
    unique,
  SHORT_NAME  VARCHAR2(80 char) not null
    constraint UN_TSTT_SHORTNAME
    unique
)
/

create table LAB_GROUP_TEST_TYPE
(
  ID                      NUMBER(19) generated as identity
    primary key,
  LAB_GROUP_ID            NUMBER(19)
    constraint FK_LGRPTSTT_LABGROUP
    references LAB_GROUP,
  REPORT_NAMES_BAR_SEP    VARCHAR2(4000 char),
  TEST_CONFIGURATION_JSON CLOB
    constraint CK_LGRPTSTT_TSTOPTSJSON_ISJSON
    check (test_configuration_json is json format json strict),
  TEST_TYPE_ID            NUMBER(19) not null
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
  ID                       NUMBER(19) generated as identity
    primary key,
  BEGIN_DATE               DATE,
  CREATED                  TIMESTAMP(6)      not null,
  CREATED_BY_EMP_ID        NUMBER(19)
    constraint FK_TST_EMP_CREATED
    references EMPLOYEE,
  LAB_GROUP_ID             NUMBER(19)
    constraint FK_TST_LABGRP
    references LAB_GROUP,
  LAST_SAVED               TIMESTAMP(6)      not null,
  LAST_SAVED_BY_EMP_ID     NUMBER(19)
    constraint FK_TST_EMP_LASTSAVED
    references EMPLOYEE,
  NOTE                     VARCHAR2(200 char),
  REVIEWED                 TIMESTAMP(6),
  REVIEWED_BY_EMP_ID       NUMBER(19)
    constraint FK_TST_EMP_REVIEWED
    references EMPLOYEE,
  SAMPLE_ID                NUMBER(19)
    constraint FK_TST_RCVSMP
    references SAMPLE,
  SAVED_TO_FACTS           TIMESTAMP(6),
  SAVED_TO_FACTS_BY_EMP_ID NUMBER(19)
    constraint FK_TST_EMP_SAVEDTOFACTS
    references EMPLOYEE,
  STAGE_STATUSES_JSON      VARCHAR2(4000 char)
    constraint CK_TEST_STAGESTATUSJSON_ISJSON
    check (stage_statuses_json is json format json strict),
  TEST_DATA_JSON           CLOB
    constraint CK_TEST_TESTDATAJSON_ISJSON
    check (test_data_json is json format json strict),
  TEST_DATA_MD5            VARCHAR2(32 char) not null,
  TEST_TYPE_ID             NUMBER(19)        not null
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

create index IX_TST_SAVEDTOFACTSEMPID
  on TEST (SAVED_TO_FACTS_BY_EMP_ID)
/

create index IX_TST_TESTDATAMD5
  on TEST (TEST_DATA_MD5)
/

create table TEST_FILE
(
  ID       NUMBER(19) generated as identity
    primary key,
  DATA     BLOB               not null,
  NAME     VARCHAR2(200 char) not null,
  ROLE     VARCHAR2(50 char),
  TEST_ID  NUMBER(19)
    constraint FK_TSTFILE_TST
    references TEST,
  UPLOADED TIMESTAMP(6)       not null
)
/

create index IX_TSTFILE_TSTID
  on TEST_FILE (TEST_ID)
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



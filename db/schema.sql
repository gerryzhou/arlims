create table AUDIT_ENTRY
(
  ID                           NUMBER(19) generated as identity
    primary key,
  ACTING_EMP_ID                NUMBER(19)         not null,
  ACTING_USERNAME              VARCHAR2(150 char) not null,
  ACTION                       VARCHAR2(50 char)  not null,
  LAB_GROUP_ID                 NUMBER(19)         not null,
  OBJECT_CONTEXT_METADATA_JSON CLOB
    constraint CK_AUDENT_OBJMD_ISJSON
    check (object_context_metadata_json is json format json strict),
  OBJECT_FROM_VALUE_JSON       CLOB
    constraint CK_AUDENT_OBJFROMVAL_ISJSON
    check (object_from_value_json is json format json strict),
  OBJECT_TO_VALUE_JSON         CLOB
    constraint CK_AUDENT_OBJTOVAL_ISJSON
    check (object_to_value_json is json format json strict),
  OBJECT_TYPE                  VARCHAR2(50 char)  not null,
  TEST_ID                      NUMBER(19),
  TIMESTAMP                    TIMESTAMP(6)       not null
)
/

create index IX_AUDENT_TIMESTAMP
  on AUDIT_ENTRY (TIMESTAMP)
/

create index IX_AUDENT_TESTID
  on AUDIT_ENTRY (TEST_ID)
/

create index IX_AUDENT_LABGRPID
  on AUDIT_ENTRY (LAB_GROUP_ID)
/

create index IX_AUDENT_EMPID
  on AUDIT_ENTRY (ACTING_EMP_ID)
/

create index IX_AUDENT_OBJT
  on AUDIT_ENTRY (OBJECT_TYPE)
/

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
  FACTS_PARENT_ORG_NAME VARCHAR2(20 char) not null,
  NAME                  VARCHAR2(20 char) not null
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
  LAB_GROUP_ID  NUMBER(19)        not null
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
  FACTS_STATUS              VARCHAR2(1 char)   not null,
  FACTS_STATUS_TIMESTAMP    TIMESTAMP(6)       not null,
  LAB_GROUP_ID              NUMBER(19)         not null
    constraint FK_SMP_LABGROUP
    references LAB_GROUP,
  LAST_REFRESHED_FROM_FACTS TIMESTAMP(6)       not null,
  LID                       VARCHAR2(20 char),
  OPERATION_CODE            VARCHAR2(255 char) not null,
  PAC                       VARCHAR2(20 char)  not null,
  PAF                       VARCHAR2(20 char),
  PRODUCT_NAME              VARCHAR2(100 char),
  SAMPLE_ANALYSIS_ID        NUMBER(19)         not null,
  SAMPLE_TRACKING_NUM       NUMBER(19)         not null,
  SAMPLE_TRACKING_SUB_NUM   NUMBER(19)         not null,
  SAMPLING_ORG              VARCHAR2(30 char),
  SPLIT_IND                 VARCHAR2(1 char),
  SUBJECT                   VARCHAR2(4000 char),
  WORK_ID                   NUMBER(19)         not null
    constraint UN_SMP_WORKID
    unique,
  WORK_REQUEST_ID           NUMBER(19)         not null
)
/

create index IX_SMP_LABGRPID
  on SAMPLE (LAB_GROUP_ID)
/

create index IX_SMP_FACTSSTATUS
  on SAMPLE (FACTS_STATUS)
/

create table SAMPLE_ASSIGNMENT
(
  ID               NUMBER(19) generated as identity
    primary key,
  ASSIGNED_INSTANT TIMESTAMP(6),
  EMPLOYEE_ID      NUMBER(19) not null
    constraint FK_SMPAST_EMP
    references EMPLOYEE,
  LEAD             NUMBER(1),
  SAMPLE_ID        NUMBER(19) not null
    constraint FK_SMPAST_SMP
    references SAMPLE,
  constraint UN_SMPAST_SMPIDEMPID
  unique (SAMPLE_ID, EMPLOYEE_ID)
)
/

create index IX_SMPAST_EMPID
  on SAMPLE_ASSIGNMENT (EMPLOYEE_ID)
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
  REPORT_NAMES_BAR_SEP    VARCHAR2(4000 char),
  TEST_CONFIGURATION_JSON CLOB
    constraint CK_LGRPTSTT_TSTOPTSJSON_ISJSON
    check (test_configuration_json is json format json strict),
  LAB_GROUP_ID            NUMBER(19) not null
    constraint FK_LGRPTSTT_LABGROUP
    references LAB_GROUP,
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
  CREATED_BY_EMP_ID        NUMBER(19)        not null
    constraint FK_TST_EMP_CREATED
    references EMPLOYEE,
  LAB_GROUP_ID             NUMBER(19)        not null
    constraint FK_TST_LABGRP
    references LAB_GROUP,
  LAST_SAVED               TIMESTAMP(6)      not null,
  LAST_SAVED_BY_EMP_ID     NUMBER(19)        not null
    constraint FK_TST_EMP_LASTSAVED
    references EMPLOYEE,
  NOTE                     VARCHAR2(200 char),
  REVIEWED                 TIMESTAMP(6),
  REVIEWED_BY_EMP_ID       NUMBER(19)
    constraint FK_TST_EMP_REVIEWED
    references EMPLOYEE,
  SAMPLE_ID                NUMBER(19)        not null
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
  TEST_ID  NUMBER(19)         not null
    constraint FK_TSTFILE_TST
    references TEST,
  UPLOADED TIMESTAMP(6)       not null
)
/

create index IX_TSTFILE_TSTID
  on TEST_FILE (TEST_ID)
/


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
  NAME                  VARCHAR2(20 char) not null
    constraint UN_LABGRP_NAME
      unique
)
/

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
/

create index IX_EMP_LABGROUPID
  on EMPLOYEE (LAB_GROUP_ID)
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
  TEST_CONFIGURATION_JSON CLOB,
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
      references TEST_TYPE
)
/

create index IX_TST_OPID
  on TEST (OP_ID)
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
/

create index IX_TSTFILE_TSTID
  on TEST_FILE (TEST_ID)
/

create index IX_TSTFILE_TESTDATAPART
  on TEST_FILE (TEST_DATA_PART)
/


-------------------------------------------------------------------------------
-- manually created tables

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


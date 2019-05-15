create table audit_entry
(
    id                           serial                   not null
        constraint audit_entry_pkey
            primary key,
    timestamp                    timestamp with time zone not null,
    acting_emp_id                int                      not null,
    acting_username              varchar(150)             not null,
    lab_group_id                 int                      not null,
    action                       varchar(50)              not null,
    object_type                  varchar(50)              not null,
    object_context_metadata_json jsonb,
    object_from_value_json       jsonb,
    object_to_value_json         jsonb,
    test_id                      int
);

create index ix_audent_timestamp
    on audit_entry (timestamp);

create index ix_audent_testid
    on audit_entry (test_id);

create index ix_audent_labgrpid
    on audit_entry (lab_group_id);

create index ix_audent_empid
    on audit_entry (acting_emp_id);

create index ix_audent_objt
    on audit_entry (object_type);

create table lab_group
(
    id                  serial      not null
        constraint lab_group_pkey
            primary key,
    name                varchar(20) not null
        constraint un_labgrp_name
            unique,
    description         varchar(100),
    facts_org_name      varchar(20) not null,
    address_city        varchar(200),
    address_state       varchar(2),
    address_street      varchar(200),
    address_zip         varchar(11),
    buildings_and_rooms varchar(200)
);

create table employee
(
    id                     serial       not null
        constraint employee_pkey
            primary key,
    lab_group_id           int          not null
        constraint fk_emp_labgroup
            references lab_group,
    facts_person_id        int          not null
        constraint un_emp_factspersonid
            unique,
    fda_email_account_name varchar(150) not null
        constraint un_emp_fdaemailaccn
            unique,
    short_name             varchar(10)  not null,
    first_name             varchar(60)  not null,
    last_name              varchar(60)  not null,
    middle_name            varchar(60),
    password               varchar(200),
    constraint un_emp_shortnamelabgrp
        unique (short_name, lab_group_id)
);

create index ix_emp_labgroupid
    on employee (lab_group_id);

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

create table test_type
(
    id          serial   not null
        constraint test_type_pkey
            primary key,
    name        varchar(80) not null
        constraint un_tstt_name
            unique,
    short_name  varchar(80) not null
        constraint un_tstt_shortname
            unique,
    code        varchar(50) not null
        constraint un_tstt_code
            unique,
    description varchar(2000)
);

create table lab_group_test_type
(
    lab_group_id            int    not null
        constraint fk_lgrptstt_labgroup
            references lab_group,
    test_type_id            int    not null
        constraint fk_lgrptstt_testtype
            references test_type,
    test_configuration_json jsonb,
    report_names_bar_sep    varchar(4000),
    constraint pk_lgrptstt_pk primary key (lab_group_id, test_type_id)
);

create index ix_lgrptstt_tsttid
    on lab_group_test_type (test_type_id);

create table test
(
    id                       serial    not null
        constraint test_pkey
            primary key,
    lab_group_id             int       not null
        constraint fk_tst_labgrp
            references lab_group,
    test_type_id             int       not null
        constraint fk_tst_tstt
            references test_type,
    test_data_json           jsonb,
    test_data_md5            varchar(32)  not null,
    stage_statuses_json      jsonb,
    op_id                    int       not null,
    sample_tracking_num      int       not null,
    sample_tracking_sub_num  int       not null,
    product_name             varchar(500) not null,
    lid                      varchar(20),
    pac                      varchar(20)  not null,
    paf                      varchar(20),
    subject                  varchar(500),
    begin_date               date,
    created                  timestamp with time zone    not null,
    created_by_emp_id        int       not null
        constraint fk_tst_emp_created
            references employee,
    last_saved               timestamp with time zone    not null,
    last_saved_by_emp_id     int       not null
        constraint fk_tst_emp_lastsaved
            references employee,
    reviewed                 timestamp with time zone,
    reviewed_by_emp_id       int
        constraint fk_tst_emp_reviewed
            references employee,
    saved_to_facts           timestamp with time zone,
    saved_to_facts_by_emp_id int
        constraint fk_tst_emp_savedtofacts
            references employee,
    note                     varchar(200)
);

create index ix_tst_opid
    on test (op_id);

create index ix_tst_testtypeid
    on test (test_type_id);

create index ix_tst_labgrpid
    on test (lab_group_id);

create index ix_tst_created
    on test (created);

create index ix_tst_createdempid
    on test (created_by_emp_id);

create index ix_tst_lastsaved
    on test (last_saved);

create index ix_tst_lastsavedempid
    on test (last_saved_by_emp_id);

create index ix_tst_begindate
    on test (begin_date);

create index ix_tst_reviewedempid
    on test (reviewed_by_emp_id);

create index ix_tst_savedtofacts
    on test (saved_to_facts);

create index ix_tst_savedtofactsempid
    on test (saved_to_facts_by_emp_id);

create index ix_tst_testdatamd5
    on test (test_data_md5);

-- json path index on test_data_json
create index ix_test_tstdtajson ON test using gin (test_data_json jsonb_path_ops);

-- Create full text search configuration and index on test data json.
create text search configuration test_data_text_search_config (copy=simple);
create index test_testdatajson_text_ix on test using gin (to_tsvector('test_data_text_search_config', test_data_json));


create table test_file
(
    id             serial    not null
        constraint test_file_pkey
            primary key,
    test_id        int       not null
        constraint fk_tstfile_tst
            references test,
    test_data_part varchar(4000),
    name           varchar(200) not null,
    data           oid          not null, -- TODO
    label          varchar(50),
    ordering       int       not null,
    uploaded       timestamp with time zone    not null
);

create index ix_tstfile_tstid
    on test_file (test_id);

create index ix_tstfile_testdatapart
    on test_file (test_data_part);


create table test_type_search_scope
(
    test_type_id  int    not null
        constraint fk_testtypesearchscope_testtype
            references test_type,
    scope_name   varchar(20) not null,
    scope_descr   varchar(100) not null,
    search_fields jsonb not null, -- array of TestSearchField dto
    constraint pk_testtypesearchscope primary key (test_type_id, scope_name)
);

create table resource_group
(
    name        varchar(50) not null
        constraint pk_rscgrp
            primary key,
    description varchar(200)
);

create table lab_group_resource_group
(
    lab_group_id   int      not null
        constraint fk_labgrprscgrp_labgrp
            references lab_group,
    resource_group varchar(50) not null,
    constraint pk_labgrprscgrp
        primary key (lab_group_id, resource_group)
);

create table resource
(
    resource_group varchar(50) not null
        constraint fk_rscgrp
            references resource_group,
    code           varchar(50) not null,
    resource_type  varchar(60) not null,
    description    varchar(100),
    constraint pk_resource
        primary key (resource_group, code)
);

create view "RESOURCE" as
select
   resource_group,
   code,
   resource_type,
   description
from resource;


create view test_v as
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
   (select array_agg(r.name) from role r
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
   jsonb_build_object(
      'employee_id', employee_id,
      'facts_person_id', facts_person_id,
      'fda_email_account_name', fda_email_account_name,
      'short_name', short_name
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
   jsonb_build_object(
     'test_configuration_json', test_configuration_json,
     'report_names_bar_sep', report_names_bar_sep,
     'test_type_id', test_type_id,
     'test_type_code', test_type_code,
     'test_type_name', test_type_name,
     'test_type_short_name', test_type_short_name,
     'test_type_description', test_type_description
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
join resource r on r.resource_group = lgrg.resource_group
;

create view lab_group_resource_jv as
select
   lab_group_id,
   jsonb_build_object(
      'resource_type',  resource_type,
      'code',           code,
      'description',    description,
      'resource_group', resource_group
   ) json
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
   (select jsonb_agg(lgtt.json)
    from lab_group_test_type_jv lgtt
    where lgtt.lab_group_id = e.lab_group_id) lab_group_test_types,
   (select jsonb_agg(ur.json)
    from employee_reference_jv ur
    where ur.lab_group_id = e.lab_group_id) lab_group_employees,
   (select jsonb_agg(lgr.json)
    from lab_group_resource_jv lgr
    where lgr.lab_group_id = e.lab_group_id) lab_group_resources
from employee_v e
;


create or replace function blob_size(oid) returns integer
as $$
declare
    fd integer;
    sz integer;
begin
    fd = lo_open($1, 262144);
    if (fd<0) then
        raise exception 'Failed to open large object %', $1;
    end if;
    sz=lo_lseek(fd,0,2);
    if (lo_close(fd)!=0) then
        raise exception 'Failed to close large object %', $1;
    end if;
    return sz;
end;
$$ language 'plpgsql';

-- For use in data.sql.
create replace function make_json(str text) returns jsonb
as $$
    select str::jsonb;
$$ language 'sql';

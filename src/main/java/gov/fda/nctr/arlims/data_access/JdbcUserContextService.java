package gov.fda.nctr.arlims.data_access;

import javax.transaction.Transactional;

import org.springframework.jdbc.core.JdbcTemplate;

import gov.fda.nctr.arlims.models.dto.UserContext;

/*
public class JdbcUserService implements UserContextService
{
    private final JdbcTemplate jdbc;

    public JdbcUserService(JdbcTemplate jdbcTemplate)
    {
        this.jdbc = jdbcTemplate;
    }


    @Transactional
    public UserContext getUserContext(String userFdaAccountName)
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO: Obtain from some header value or a lookup based on a header value.


        select
          e.id, e.facts_person_id, e.fda_email_account_name, e.first_name, e.last_name, e.short_name, e.lab_group_id,
          lg.name lab_group_name,
          -- roles
          (select listagg(r.name, ',') within group (order by r.name) roles
           from "ROLE" r
           join employee_role er on er.role_id = r.id
           where er.emp_id = e.id) roles,
          -- test types TODO: Need proper escaping of code, name, and description here (or wait for Oracle 12.2)
          (select listagg('{"id":' || tt.id || ',"code":"' || tt.code || '","name":"' || tt.name || '","description":"' || tt.description || '"}', '\n')
                    within group (order by tt.code) test_types
           from lab_group_test_type lgtt
           join test_type tt on lgtt.test_type_id = tt.id
           where lgtt.lab_group_id = lg.id) lab_test_types
        from employee e
        join lab_group lg on e.lab_group_id = lg.id

        return null;
    }
}
*/

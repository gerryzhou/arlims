package gov.fda.nctr.arlims.data_access;

import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


@Service
public class JdbcAuthenticatableUserService implements AuthenticatableUserService
{
    private final JdbcTemplate jdbc;

    public JdbcAuthenticatableUserService(JdbcTemplate jdbcTemplate)
    {
        this.jdbc = jdbcTemplate;
    }

    @Override
    public Optional<AuthenticatableUser> getAuthenticatableUser(String username)
    {
        String sql = "select password from employee where fda_email_account_name = ?";

        List<String> passwordList = jdbc.queryForList(sql, new Object[]{username}, String.class);

        if ( passwordList.isEmpty() )
            return Optional.empty();
        else
            return Optional.of(new AuthenticatableUser(username, passwordList.get(0)));
    }

}

package gov.fda.nctr.arlims.data_access.version_info;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.models.dto.AppVersion;


@Service
public class JarAppVersionService extends ServiceBase implements AppVersionService
{
    private Optional<AppVersion> appVersion;

    public JarAppVersionService()
    {
        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        ObjectReader jsonReader = jsonSerializer.readerFor(AppVersion.class);

        try ( InputStream inputStream = getClass().getClassLoader().getResourceAsStream("git.properties") )
        {
            AppVersion ver = jsonReader.readValue(inputStream);

            log.info("Application version information: " + ver);

            this.appVersion = Optional.of(ver);
        }
        catch(IOException e)
        {
            log.info("Could not retrieve application info (normal if in dev mode).");
            this.appVersion = Optional.empty();
        }
    }

    @Override
    public Optional<AppVersion> getAppVersion()
    {
        return appVersion;
    }
}

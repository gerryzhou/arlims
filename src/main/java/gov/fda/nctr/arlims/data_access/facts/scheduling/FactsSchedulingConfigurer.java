package gov.fda.nctr.arlims.data_access.facts.scheduling;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import gov.fda.nctr.arlims.data_access.ServiceBase;


@Configuration
public class FactsSchedulingConfigurer extends ServiceBase implements SchedulingConfigurer
{
    private int threadPoolSize;

    public FactsSchedulingConfigurer
        (
            @Value("${facts.scheduling.thread-pool-size:5}") int threadPoolSize
        )
    {
        this.threadPoolSize = threadPoolSize;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar)
    {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(threadPoolSize);

        log.info("Reserving " + threadPoolSize + " threads for FACTS scheduling.");

        scheduler.setThreadNamePrefix("facts-scheduler-");

        scheduler.initialize();

        scheduledTaskRegistrar.setTaskScheduler(scheduler);
    }
}

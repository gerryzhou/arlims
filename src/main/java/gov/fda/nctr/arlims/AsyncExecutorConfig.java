package gov.fda.nctr.arlims;

import java.util.concurrent.Executor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;


@Configuration
public class AsyncExecutorConfig
{
    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    @Value("${async-tasks.core-pool-size:#{4}}")
    private int corePoolSize;

    @Value("${async-tasks.max-pool-size:#{8}}")
    private int maxPoolSize;

    @Value("${async-tasks.queue-capacity:#{50}}")
    private int queueCapacity;

    @Bean
    public Executor taskExecutor()
    {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix("async-tasks-");
        executor.initialize();
        return executor;
    }
}

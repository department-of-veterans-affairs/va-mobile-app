import com.facebook.react.bridge.ReactApplicationContext
import gov.va.mobileapp.native_modules.CustomTabsIntentManager
import junit.framework.TestCase.assertEquals
import junit.framework.TestCase.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.mockito.junit.MockitoJUnitRunner

@RunWith(MockitoJUnitRunner::class)
class CustomTabsIntentManagerTest {

    @Mock
    private lateinit var reactContext: ReactApplicationContext
    private lateinit var manager: CustomTabsIntentManager

    @Before
    fun setUp() {
        reactContext = mock(ReactApplicationContext::class.java)
        manager = CustomTabsIntentManager()
    }

    @Test
    fun testCreateViewManagersReturnsEmptyList() {
        val viewManagers = manager.createViewManagers(reactContext)
        assertTrue(viewManagers.isEmpty())
    }

    @Test
    fun testCreateNativeModulesReturnsCustomTabsIntentModule() {
        val nativeModules = manager.createNativeModules(reactContext)
        assertEquals(1, nativeModules.size)
    }
}
